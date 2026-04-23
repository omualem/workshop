import { Injectable } from "@nestjs/common";
import { haversineDistanceKm } from "@rental/utils";
import type { BundleSearchInput, RequestedItemInput } from "@rental/types";
import { PrismaService } from "../../prisma/prisma.service";
import { AvailabilityService } from "../availability/availability.service";
import { PricingService } from "../pricing/pricing.service";
import { LenderReliabilityService } from "./lender-reliability.service";
import type { GeneratedBundle, ListingWithRelations, SlotCandidate } from "./bundle-search.types";

const MAX_SLOT_CANDIDATES = 6;
const MAX_COMBINATIONS = 180;

@Injectable()
export class BundleGenerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
    private readonly pricingService: PricingService,
    private readonly lenderReliabilityService: LenderReliabilityService,
  ) {}

  async findCandidatesPerSlot(input: BundleSearchInput) {
    const result: Record<string, SlotCandidate[]> = {};
    const counts: Record<string, { beforePruning: number; afterPruning: number }> = {};

    for (const slot of input.requestedItems) {
      const rawListings = await this.fetchListingsForSlot(slot);
      const enrichedCandidates: SlotCandidate[] = [];

      for (const listing of rawListings) {
        const distanceKm = haversineDistanceKm(
          { lat: input.renterLocation.lat, lng: input.renterLocation.lng },
          { lat: Number(listing.pickupLat), lng: Number(listing.pickupLng) },
        );

        if (slot.constraints.distanceMaxKm && distanceKm > slot.constraints.distanceMaxKm) {
          continue;
        }

        const available = await this.availabilityService.isListingAvailable(
          listing.id,
          slot.quantity,
          new Date(input.dateRange.startDate),
          new Date(input.dateRange.endDate),
          listing.inventoryCount,
        );

        if (!available) {
          continue;
        }

        const priceQuote = this.pricingService.computeListingPrice(
          listing,
          new Date(input.dateRange.startDate),
          new Date(input.dateRange.endDate),
          slot.quantity,
        );

        if (slot.constraints.priceMax && priceQuote.total > slot.constraints.priceMax) {
          continue;
        }

        const reliabilityScore = this.lenderReliabilityService.compute({
          averageRating: Number(listing.lender.averageRating),
          completedTransactionsCount: listing.lender.completedTransactionsCount,
          cancellationRate: Number(listing.lender.cancellationRate),
          lateReturnRate: Number(listing.lender.lateReturnRate),
          complaintRate: Number(listing.lender.complaintRate),
          verificationLevel: listing.lender.verificationLevel,
          responseTimeScore: Number(listing.lender.responseTimeScore),
        });

        const qualityScore = this.computeListingQualityScore(listing);
        const availabilityFitScore = await this.availabilityService.availabilityFragilityScore(
          listing.id,
          new Date(input.dateRange.startDate),
          new Date(input.dateRange.endDate),
        );
        const prelimScore =
          reliabilityScore * 0.3 +
          qualityScore * 0.2 +
          availabilityFitScore * 0.2 +
          Math.max(0, 10 - distanceKm / 3) * 0.15 +
          Math.max(0, 10 - priceQuote.total / 250) * 0.15;

        enrichedCandidates.push({
          slot,
          listing,
          estimatedPrice: priceQuote.total,
          distanceKm,
          reliabilityScore,
          qualityScore,
          availabilityFitScore,
          prelimScore,
        });
      }

      const pruned = this.pruneCandidates(enrichedCandidates);
      result[slot.slotKey] = pruned;
      counts[slot.slotKey] = {
        beforePruning: enrichedCandidates.length,
        afterPruning: pruned.length,
      };

      if (slot.optional) {
        result[slot.slotKey] = [
          ...pruned,
          {
            slot,
            listing: null,
            omitted: true,
            estimatedPrice: 0,
            distanceKm: 0,
            reliabilityScore: 6,
            qualityScore: 6,
            availabilityFitScore: 6,
            prelimScore: 4,
          },
        ];
      }
    }

    return { result, counts };
  }

  generateBundles(input: BundleSearchInput, slotCandidates: Record<string, SlotCandidate[]>) {
    const slots = input.requestedItems;
    const combinations: GeneratedBundle[] = [];
    const seen = new Set<string>();

    const walk = (index: number, acc: SlotCandidate[]) => {
      if (combinations.length >= MAX_COMBINATIONS) {
        return;
      }

      if (index === slots.length) {
        const concreteItems = acc.filter((item) => item.listing);
        if (concreteItems.length === 0) {
          return;
        }

        const dedupeKey = concreteItems
          .map((item) => `${item.slot.slotKey}:${item.listing!.id}`)
          .sort()
          .join("|");

        if (seen.has(dedupeKey)) {
          return;
        }

        seen.add(dedupeKey);
        const pickupPoints = new Set(
          concreteItems.map(
            (item) => `${item.listing!.lenderId}:${item.listing!.pickupLat}:${item.listing!.pickupLng}`,
          ),
        );
        const lenders = new Set(concreteItems.map((item) => item.listing!.lenderId));

        combinations.push({
          items: [...acc],
          totalPrice: concreteItems.reduce((sum, item) => sum + item.estimatedPrice, 0),
          totalDistanceKm: concreteItems.reduce((sum, item) => sum + item.distanceKm, 0),
          pickupPointsCount: pickupPoints.size,
          lendersCount: lenders.size,
          exactAvailabilityFit: concreteItems.every((item) => item.availabilityFitScore >= 5),
          requestedItemsCount: slots.length,
        });
        return;
      }

      const slot = slots[index];
      const candidates = slotCandidates[slot.slotKey] ?? [];

      for (const candidate of candidates) {
        walk(index + 1, [...acc, candidate]);
      }
    };

    walk(0, []);
    return combinations;
  }

  private async fetchListingsForSlot(slot: RequestedItemInput): Promise<ListingWithRelations[]> {
    const listings = (await this.prisma.listing.findMany({
      where: {
        id: slot.constraints.exactListingId,
        categoryId: slot.categoryId,
        status: "ACTIVE",
      },
      include: {
        lender: true,
        media: true,
        attributeValues: true,
        pricingRules: true,
        reviews: {
          select: { rating: true },
        },
      },
      take: 30,
      orderBy: [{ qualityScoreCached: "desc" }, { createdAt: "desc" }],
    })) as unknown as ListingWithRelations[];

    const conditionOrder = ["HEAVY_USE", "FAIR", "GOOD", "LIKE_NEW", "NEW"];
    const minimumConditionIndex = slot.constraints.conditionMin
      ? conditionOrder.indexOf(slot.constraints.conditionMin)
      : -1;

    return listings.filter((listing: ListingWithRelations) => {
      if (minimumConditionIndex >= 0) {
        const listingConditionIndex = conditionOrder.indexOf(listing.condition);
        if (listingConditionIndex < minimumConditionIndex) {
          return false;
        }
      }

      if (slot.constraints.attributes) {
        return Object.entries(slot.constraints.attributes).every(([key, value]) => {
          const attribute = listing.attributeValues.find(
            (entry: { attributeKey: string; attributeValue: unknown }) => entry.attributeKey === key,
          );
          return attribute && JSON.stringify(attribute.attributeValue) === JSON.stringify(value);
        });
      }

      return true;
    });
  }

  private pruneCandidates(candidates: SlotCandidate[]) {
    const byPrelim = [...candidates].sort((a, b) => b.prelimScore - a.prelimScore);
    const lenderSeen = new Set<string>();
    const selected: SlotCandidate[] = [];

    for (const candidate of byPrelim) {
      if (selected.length >= MAX_SLOT_CANDIDATES) {
        break;
      }

      const lenderId = candidate.listing?.lenderId ?? "omitted";

      if (!lenderSeen.has(lenderId) || selected.length < 3) {
        lenderSeen.add(lenderId);
        selected.push(candidate);
      }
    }

    const cheapest = [...candidates].sort((a, b) => a.estimatedPrice - b.estimatedPrice)[0];
    if (cheapest && !selected.some((candidate) => candidate.listing?.id === cheapest.listing?.id)) {
      selected.push(cheapest);
    }

    return selected.slice(0, MAX_SLOT_CANDIDATES);
  }

  private computeListingQualityScore(listing: ListingWithRelations) {
    const imageCountScore = Math.min(10, listing.media.length * 2);
    const descriptionScore =
      Math.min(2, listing.descriptionHe.length / 120) + Math.min(2, listing.descriptionEn.length / 120);
    const attributeScore = Math.min(2, listing.attributeValues.length / 3);
    const reviewAvg =
      listing.reviews.length > 0
        ? listing.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) /
            listing.reviews.length
        : 4.2;
    const ratingScore = (reviewAvg / 5) * 2;
    const conditionScore =
      ({
        NEW: 2,
        LIKE_NEW: 1.8,
        GOOD: 1.5,
        FAIR: 1,
        HEAVY_USE: 0.5,
      } as Record<string, number>)[listing.condition] ?? 1;

    return Math.max(
      0,
      Math.min(10, imageCountScore * 0.25 + descriptionScore * 1.2 + attributeScore + ratingScore + conditionScore),
    );
  }
}
