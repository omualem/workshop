import { Injectable } from "@nestjs/common";
import { haversineDistanceKm } from "@rental/utils";
import { PrismaService } from "../../prisma/prisma.service";
import { AvailabilityService } from "../availability/availability.service";
import { PricingService } from "../pricing/pricing.service";
import { LenderReliabilityService } from "./lender-reliability.service";
import { ListingRatingService } from "./listing-rating.service";
import { decimalToNumber } from "../../shared/utils/prisma.utils";
import { MetricNormalizationService } from "./metric-normalization.service";
import type {
  CandidateItem,
  ItemReliabilityBreakdown,
  OptimizerRequest,
  SlotFilterDebug,
  SlotConstraints,
  SlotInput,
} from "./bundle-optimizer.types";

const ROUGH_PREFILTER_POOL_SIZE = 100;

/**
 * Mixing weight between lender reliability and item-level rating score.
 *
 *   r_i = THETA · lenderReliability + (1 − THETA) · itemRatingScore
 *
 * Lender history dominates (0.7) since it covers transaction execution
 * across many bookings; item rating (0.3) refines for product-specific
 * quality once enough distinct raters exist. Server-owned; never client.
 */
const RELIABILITY_THETA = 0.7;

// Soft bonus added to the preliminary score of the user's preferred listing
// in specificListing+allowAlternatives mode, so beam search prefers it over
// alternatives when feasibility ties. Small enough that hard objective wins.
const PREFERRED_LISTING_BONUS = 0.5;

/**
 * Candidate filter — implements the HARD constraints of the model.
 *
 * Per slot s ∈ S:
 *
 *   I_s = { listings ℓ :
 *             (mode=category ?  category(ℓ) = s.categoryId
 *                            :  ℓ ∈ {specificListing} ∪ alternatives(s))
 *             ∧ status(ℓ) = ACTIVE
 *             ∧ availability(ℓ, dateRange) ≥ s.quantity
 *             ∧ minPrice ≤ p(ℓ) ≤ maxPrice
 *             ∧ d(ℓ) ≤ maxDistanceKm
 *             ∧ p(ℓ) ≤ B
 *         }
 *
 * Returns top-K candidates per slot ranked by preliminary weighted score.
 *
 * Quantity expansion:
 *   A slot with quantity = q is expanded into q internal slots
 *   "{slotKey}::1", "{slotKey}::2", ..., each carrying the same I_s.
 *   Beam search enforces inventoryCount per listing so a single listing
 *   cannot be selected more times than its available inventory.
 */
@Injectable()
export class CandidateFilterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availability: AvailabilityService,
    private readonly pricing: PricingService,
    private readonly reliability: LenderReliabilityService,
    private readonly normalization: MetricNormalizationService,
    private readonly listingRating: ListingRatingService,
  ) {}

  async buildCandidatesPerSlot(req: OptimizerRequest): Promise<{
    candidatesBySlot: Record<string, CandidateItem[]>;
    counts: {
      beforeFiltering: Record<string, number>;
      afterFiltering: Record<string, number>;
      afterTopK: Record<string, number>;
      filteredByAvailability: Record<string, number>;
      filteredByRentalDays: Record<string, number>;
      filteredByDistance: Record<string, number>;
    };
    expandedSlots: SlotInput[];
    slotDebug: Record<string, SlotFilterDebug[]>;
  }> {
    const candidatesBySlot: Record<string, CandidateItem[]> = {};
    const beforeFiltering: Record<string, number> = {};
    const afterFiltering: Record<string, number> = {};
    const afterTopK: Record<string, number> = {};
    const filteredByAvailability: Record<string, number> = {};
    const filteredByRentalDays: Record<string, number> = {};
    const filteredByDistance: Record<string, number> = {};
    const slotDebug: Record<string, SlotFilterDebug[]> = {};

    const startDate = new Date(req.dateRange.startDate);
    const endDate = new Date(req.dateRange.endDate);
    const durationDays = this.computeDurationDays(startDate, endDate);

    // Expand each user slot into q internal slots when quantity > 1.
    const expandedSlots: SlotInput[] = [];
    for (const slot of req.slots) {
      const q = Math.max(1, slot.quantity ?? 1);
      if (q === 1) {
        expandedSlots.push(slot);
      } else {
        for (let i = 1; i <= q; i++) {
          expandedSlots.push({
            ...slot,
            slotKey: `${slot.slotKey}::${i}`,
            quantity: 1,
          });
        }
      }
    }

    // Listing rating aggregates are cached across slots; the same listing
    // can appear in multiple slots (e.g. different quantities) so one
    // query per request is enough.
    const ratingAggregateCache = new Map<
      string,
      { averageRating: number; distinctRaterCount: number }
    >();

    for (const slot of expandedSlots) {
      const constraints = this.normalizeConstraints(slot);

      // Step 1 — load the raw listing pool for this slot.
      const rawListings = await this.loadSlotListings(slot, constraints);
      await this.primeRatingAggregates(
        rawListings.map((l) => l.id),
        ratingAggregateCache,
      );
      beforeFiltering[slot.slotKey] = rawListings.length;
      filteredByAvailability[slot.slotKey] = 0;
      filteredByRentalDays[slot.slotKey] = 0;
      filteredByDistance[slot.slotKey] = 0;
      slotDebug[slot.slotKey] = [];

      // Track the user's preferred specific listing for the soft bonus.
      const preferredListingId =
        slot.mode === "specificListing" ? slot.specificListingId : undefined;

      const survivors: CandidateItem[] = [];

      for (const listing of rawListings) {
        const pickupLat = decimalToNumber(listing.pickupLat) ?? 0;
        const pickupLng = decimalToNumber(listing.pickupLng) ?? 0;
        const distanceKm = haversineDistanceKm(
          { lat: req.userLocation.lat ?? 0, lng: req.userLocation.lng ?? 0 },
          { lat: pickupLat, lng: pickupLng },
        );
        const entryDebug: SlotFilterDebug = {
          listingId: listing.id,
          titleHe: listing.titleHe,
          distanceKm,
          availability: false,
          durationDays,
          minRentalDays: listing.minRentalDays,
          maxRentalDays: listing.maxRentalDays,
        };

        // (a) Status
        if (listing.status !== "ACTIVE") continue;

        // (b) Availability: a_i ≥ requested quantity over [startDate, endDate]
        if (
          durationDays < listing.minRentalDays ||
          durationDays > listing.maxRentalDays
        ) {
          filteredByRentalDays[slot.slotKey] += 1;
          entryDebug.filteredOutBy = "rentalDays";
          slotDebug[slot.slotKey].push(entryDebug);
          continue;
        }

        const isAvailable = await this.availability.isListingAvailable(
          listing.id,
          slot.quantity ?? 1,
          startDate,
          endDate,
          listing.inventoryCount,
        );
        entryDebug.availability = isAvailable;
        if (!isAvailable) {
          filteredByAvailability[slot.slotKey] += 1;
          entryDebug.filteredOutBy = "availability";
          slotDebug[slot.slotKey].push(entryDebug);
          continue;
        }

        // (c) Price computation + min/max price + global budget
        const priceQuote = this.pricing.computeListingPrice(
          listing as any,
          startDate,
          endDate,
          slot.quantity ?? 1,
        );
        if (priceQuote.total > req.budget) continue;
        if (
          constraints.maxPrice !== undefined &&
          priceQuote.total > constraints.maxPrice
        ) {
          continue;
        }
        if (
          constraints.minPrice !== undefined &&
          priceQuote.total < constraints.minPrice
        ) {
          continue;
        }

        if (
          constraints.maxDistanceKm !== undefined &&
          distanceKm > constraints.maxDistanceKm
        ) {
          filteredByDistance[slot.slotKey] += 1;
          entryDebug.filteredOutBy = "distance";
          slotDebug[slot.slotKey].push(entryDebug);
          continue;
        }
        slotDebug[slot.slotKey].push(entryDebug);

        // --- Raw signals ---
        const reliabilityOverride =
          decimalToNumber(listing.lender.reliabilityScoreCached) ?? 0;
        const lenderReliability =
          reliabilityOverride > 0
            ? Math.max(0, Math.min(10, reliabilityOverride))
            : this.reliability.compute({
                averageRating: decimalToNumber(listing.lender.averageRating) ?? 0,
                completedTransactionsCount:
                  listing.lender.completedTransactionsCount,
                cancellationRate:
                  decimalToNumber(listing.lender.cancellationRate) ?? 0,
                lateReturnRate:
                  decimalToNumber(listing.lender.lateReturnRate) ?? 0,
                complaintRate:
                  decimalToNumber(listing.lender.complaintRate) ?? 0,
                verificationLevel: listing.lender.verificationLevel as
                  | "BASIC"
                  | "VERIFIED"
                  | "TRUSTED",
                responseTimeScore:
                  decimalToNumber(listing.lender.responseTimeScore) ?? 5,
              });

        const aggregate = ratingAggregateCache.get(listing.id) ?? {
          averageRating: 0,
          distinctRaterCount: 0,
        };
        const itemRating = this.listingRating.compute(aggregate);

        // r_i = θ · lenderReliability + (1 − θ) · itemRatingScore
        // When v_i = 0 the item rating is not folded in; the listing is
        // not penalized for missing ratings.
        const reliability =
          itemRating.itemRatingScore !== null
            ? Math.max(
                0,
                Math.min(
                  10,
                  RELIABILITY_THETA * lenderReliability +
                    (1 - RELIABILITY_THETA) * itemRating.itemRatingScore,
                ),
              )
            : lenderReliability;

        const reliabilityBreakdown: ItemReliabilityBreakdown = {
          lenderReliability,
          itemAverageRating: itemRating.averageRating,
          itemDistinctRatingCount: itemRating.distinctRaterCount,
          itemRatingConfidence: itemRating.confidence,
          adjustedItemRating: itemRating.adjustedRating,
          itemRatingScore: itemRating.itemRatingScore,
          insufficientRatingInfo: itemRating.insufficient,
          finalReliabilityScore: reliability,
        };

        const deviationDays = await this.computeDeviationDays(
          listing.id,
          startDate,
          endDate,
        );
        const availabilityScore = this.normalization.availabilityFromDeviation(deviationDays);

        survivors.push({
          slotKey: slot.slotKey,
          listingId: listing.id,
          lenderId: listing.lenderId,
          pickupKey: `${listing.lenderId}:${decimalToNumber(listing.pickupLat)}:${decimalToNumber(listing.pickupLng)}`,
          titleHe: listing.titleHe,
          titleEn: listing.titleEn,
          categoryId: listing.categoryId,
          price: priceQuote.total,
          distanceKm,
          reliability,
          reliabilityBreakdown,
          availability: availabilityScore,
          pickupLat,
          pickupLng,
          inventoryCount: listing.inventoryCount,
          lenderCompletedTransactions:
            listing.lender?.completedTransactionsCount ?? 0,
          attributeValues: Array.isArray(listing.attributeValues)
            ? listing.attributeValues.map((attribute) => ({
                attributeKey: attribute.attributeKey,
                attributeValue: attribute.attributeValue,
              }))
            : [],
          deviationDays,
          m_price: 0,
          m_distance: 0,
          m_reliability: 0,
          m_availability: 0,
          preliminaryScore: 0,
        });
      }

      afterFiltering[slot.slotKey] = survivors.length;

      // --- Per-candidate normalization ---
      // Price uses a BUDGET-relative proxy (not pool-relative) so a candidate
      // priced cheaply against a tight per-slot share scores high regardless
      // of what other items happen to be in the same slot's pool. This
      // avoids the failure mode where two near-identical candidates get 0
      // and 10 just because the pool's price range is narrow, and where a
      // candidate that consumes most of the global budget scores 10 just
      // because it's the cheapest of its category.
      const perSlotBudget = Math.max(
        1,
        req.budget / Math.max(1, expandedSlots.length),
      );

      for (const c of survivors) {
        c.m_price = this.normalization.clamp(
          10 * (1 - c.price / perSlotBudget),
        );
        c.m_distance = this.normalization.normalizeDistanceScore(c.distanceKm);
        c.m_reliability = this.normalization.normalizeReliabilityScore(c.reliability);
        c.m_availability = this.normalization.normalizeAvailabilityScore(c.availability);

        const w = req.preferences.weights;
        c.preliminaryScore =
          w.price * c.m_price +
          w.distance * c.m_distance +
          w.reliability * c.m_reliability +
          w.availability * c.m_availability;

        // Soft preference for the user's chosen listing when alternatives are
        // allowed — keeps the choice "sticky" without overriding hard scoring.
        if (preferredListingId && c.listingId === preferredListingId) {
          c.preliminaryScore += PREFERRED_LISTING_BONUS;
        }
      }

      const topK = [...survivors]
        .sort((a, b) => b.preliminaryScore - a.preliminaryScore)
        .slice(0, req.preferences.topKPerSlot);

      candidatesBySlot[slot.slotKey] = topK;
      afterTopK[slot.slotKey] = topK.length;
    }

    return {
      candidatesBySlot,
      counts: {
        beforeFiltering,
        afterFiltering,
        afterTopK,
        filteredByAvailability,
        filteredByRentalDays,
        filteredByDistance,
      },
      expandedSlots,
      slotDebug,
    };
  }

  /**
   * Loads the raw listing pool for a slot, before constraint filtering.
   *
   * - mode=category:        listings whose categoryId matches.
   * - mode=specificListing: the chosen listing alone, OR the chosen listing
   *                         plus same-category alternatives if allowed.
   * - allowAlternatives=false + chosen listing inactive ⇒ empty pool ⇒ slot
   *   becomes infeasible (the optimizer surfaces this as messageHe).
   */
  private async loadSlotListings(slot: SlotInput, constraints: SlotConstraints) {
    const include = {
      lender: true,
      pricingRules: true,
      attributeValues: true,
    } as const;
    const roughPoolSize = Math.max(ROUGH_PREFILTER_POOL_SIZE, 30);
    const cheapPrefilter = {
      ...(constraints.minPrice !== undefined || constraints.maxPrice !== undefined
        ? {
            basePriceDaily: {
              ...(constraints.minPrice !== undefined
                ? { gte: constraints.minPrice }
                : {}),
              ...(constraints.maxPrice !== undefined
                ? { lte: constraints.maxPrice }
                : {}),
            },
          }
        : {}),
    };

    if (slot.mode === "specificListing") {
      const chosen = slot.specificListingId
        ? await this.prisma.listing.findUnique({
            where: { id: slot.specificListingId },
            include,
          })
        : null;

      const allowAlternatives = slot.constraints?.allowAlternatives === true;

      if (!chosen) {
        if (!allowAlternatives) return [];
        // Rare: caller asked for alternatives but specificListingId is unknown
        // — without a category we cannot fetch alternatives.
        return [];
      }

      if (!allowAlternatives) {
        return [chosen];
      }

      const alternatives = await this.prisma.listing.findMany({
        where: {
          categoryId: chosen.categoryId,
          status: "ACTIVE",
          ...cheapPrefilter,
          NOT: { id: chosen.id },
        },
        include,
        orderBy: [{ basePriceDaily: "asc" }, { updatedAt: "desc" }],
        take: roughPoolSize,
      });

      // De-duplicate by id (chosen first so it gets the soft preference bonus).
      const seen = new Set<string>([chosen.id]);
      const merged: typeof alternatives = [chosen];
      for (const alt of alternatives) {
        if (!seen.has(alt.id)) {
          seen.add(alt.id);
          merged.push(alt);
        }
      }
      return merged;
    }

    // mode = category
    if (!slot.categoryId) return [];
    // C_s(u) = Retrieve(s,u): use indexed, cheap filters before expensive
    // availability/distance/scoring work. Future: replace rough distance
    // prefilter with geohash/grid index.
    return this.prisma.listing.findMany({
      where: { categoryId: slot.categoryId, status: "ACTIVE", ...cheapPrefilter },
      include,
      orderBy: [{ basePriceDaily: "asc" }, { updatedAt: "desc" }],
      take: roughPoolSize,
    });
  }

  /**
   * Per-listing rating aggregates: average rating and the COUNT of DISTINCT
   * reviewers. Two reviews from the same user count once.
   *
   * `Review.bookingId` is unique, so duplicate booking-level reviews are
   * already impossible — but a single reviewer can still leave reviews on
   * the same listing across different bookings, and only distinct users
   * should grow the confidence factor c_i.
   */
  private async primeRatingAggregates(
    listingIds: string[],
    cache: Map<string, { averageRating: number; distinctRaterCount: number }>,
  ): Promise<void> {
    const missing = listingIds.filter((id) => !cache.has(id));
    if (missing.length === 0) return;

    const reviews = await this.prisma.review.findMany({
      where: { listingId: { in: missing } },
      select: { listingId: true, reviewerId: true, rating: true },
    });

    const grouped = new Map<
      string,
      { sum: number; count: number; reviewers: Set<string> }
    >();
    for (const r of reviews) {
      if (!r.listingId) continue;
      let entry = grouped.get(r.listingId);
      if (!entry) {
        entry = { sum: 0, count: 0, reviewers: new Set<string>() };
        grouped.set(r.listingId, entry);
      }
      entry.sum += r.rating;
      entry.count += 1;
      entry.reviewers.add(r.reviewerId);
    }

    for (const id of missing) {
      const entry = grouped.get(id);
      if (!entry || entry.count === 0) {
        cache.set(id, { averageRating: 0, distinctRaterCount: 0 });
      } else {
        cache.set(id, {
          averageRating: entry.sum / entry.count,
          distinctRaterCount: entry.reviewers.size,
        });
      }
    }
  }

  private normalizeConstraints(slot: SlotInput): SlotConstraints {
    return { ...(slot.constraints ?? {}) };
  }

  private async computeDeviationDays(
    listingId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const blocks = await this.prisma.listingAvailabilityBlock.findMany({
      where: {
        listingId,
        startDate: { lt: endDate },
        endDate: { gt: startDate },
        status: { in: ["BLOCKED", "BOOKED", "MAINTENANCE"] },
      },
      select: { startDate: true, endDate: true },
    });
    if (blocks.length === 0) return 0;

    const dayMs = 24 * 60 * 60 * 1000;
    const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / dayMs));
    const touched = new Set<number>();

    for (let day = 0; day < totalDays; day++) {
      const dayStart = startDate.getTime() + day * dayMs;
      const dayEnd = dayStart + dayMs;
      for (const b of blocks) {
        if (b.startDate.getTime() < dayEnd && b.endDate.getTime() > dayStart) {
          touched.add(day);
          break;
        }
      }
    }
    return touched.size;
  }

  private computeDurationDays(startDate: Date, endDate: Date) {
    const dayMs = 24 * 60 * 60 * 1000;
    return Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / dayMs),
    );
  }

  isSlotImpossible(candidates: CandidateItem[]): boolean {
    return candidates.length === 0;
  }

  /** Surface the slot at fault when no feasible bundle exists. */
  findEmptySlot(
    slots: SlotInput[],
    candidatesBySlot: Record<string, CandidateItem[]>,
  ): SlotInput | undefined {
    return slots.find((s) => (candidatesBySlot[s.slotKey] ?? []).length === 0);
  }
}
