import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { decimalToNumber, normalizeDecimalObject } from "../../shared/utils/prisma.utils";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../shared/redis/redis.service";
import { BundleExplanationService } from "./bundle-explanation.service";
import { BundleGenerationService } from "./bundle-generation.service";
import { RankingConfigService } from "./ranking-config.service";
import { BundleScoringService } from "./bundle-scoring.service";
import type { BundleSearchInput } from "@rental/types";

@Injectable()
export class BundleSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly rankingConfigService: RankingConfigService,
    private readonly generationService: BundleGenerationService,
    private readonly scoringService: BundleScoringService,
    private readonly explanationService: BundleExplanationService,
  ) {}

  async create(input: BundleSearchInput, renterId?: string) {
    const cacheKey = this.buildCacheKey(input);
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const weights = await this.rankingConfigService.resolveWeights(input);
    const searchRequest = await this.prisma.bundleSearchRequest.create({
      data: {
        renterId,
        searchSessionId: randomUUID(),
        dateRangeStart: new Date(input.dateRange.startDate),
        dateRangeEnd: new Date(input.dateRange.endDate),
        requestedItems: input.requestedItems as any,
        renterLocationLat: input.renterLocation.lat,
        renterLocationLng: input.renterLocation.lng,
        renterAddressText: input.renterLocation.addressText,
        weightPreferences: {
          preferenceProfile: input.preferenceProfile,
          weights,
        },
        maxBudget: input.maxBudget,
        maxPickupPoints: input.maxPickupPoints,
        sameLenderPreferred: input.sameLenderPreferred,
        deliveryPreferred: input.deliveryPreferred,
        exactDatesOnly: input.exactDatesOnly,
      },
    });

    const candidateFetchStart = Date.now();
    const { result: slotCandidates, counts } = await this.generationService.findCandidatesPerSlot(input);
    const candidateFetchMs = Date.now() - candidateFetchStart;

    const generationStart = Date.now();
    const bundles = this.generationService.generateBundles(input, slotCandidates);
    const bundleGenerationMs = Date.now() - generationStart;

    const scoringStart = Date.now();
    const scoredBundles = bundles
      .map((bundle) => {
        const scores = this.scoringService.scoreBundle(bundle, bundles, input, weights);
        const explanation = this.explanationService.build({
          ...scores,
          totalPrice: bundle.totalPrice,
          totalDistanceKm: bundle.totalDistanceKm,
          pickupPointsCount: bundle.pickupPointsCount,
          lendersCount: bundle.lendersCount,
          exactAvailabilityFit: bundle.exactAvailabilityFit,
          weakDimensions: scores.stability.weakDimensions,
        });

        return {
          bundle,
          scores,
          explanation,
        };
      })
      .sort((a, b) => b.scores.finalScore - a.scores.finalScore)
      .slice(0, 12);
    const scoringMs = Date.now() - scoringStart;

    const curatedIds = this.selectCuratedBundles(scoredBundles);

    await this.prisma.bundleCandidate.createMany({
      data: scoredBundles.map((entry, index) => ({
        id: randomUUID(),
        searchRequestId: searchRequest.id,
        scoreTotal: entry.scores.finalScore,
        priceScore: entry.scores.priceScore,
        reliabilityScore: entry.scores.reliabilityScore,
        logisticsScore: entry.scores.logisticsScore,
        availabilityScore: entry.scores.availabilityScore,
        productQualityScore: entry.scores.productQualityScore,
        stabilityScore: entry.scores.stabilityScore,
        explanation: entry.explanation as any,
        debugData: {
          timings: {
            candidateFetchMs,
            bundleGenerationMs,
            scoringMs,
          },
          penalties: entry.scores.stability,
          weights,
        } as any,
        totalPrice: entry.bundle.totalPrice,
        totalDistanceKm: entry.bundle.totalDistanceKm,
        pickupPointsCount: entry.bundle.pickupPointsCount,
        lendersCount: entry.bundle.lendersCount,
        exactAvailabilityFit: entry.bundle.exactAvailabilityFit,
        rankIndex: index,
        label:
          curatedIds.bestBalanced === index
            ? "best-balanced"
            : curatedIds.bestPrice === index
              ? "best-price"
              : curatedIds.easiestPickup === index
                ? "easiest-pickup"
                : curatedIds.mostReliable === index
                  ? "most-reliable"
                  : undefined,
      })),
    });

    const createdCandidates = await this.prisma.bundleCandidate.findMany({
      where: { searchRequestId: searchRequest.id },
      orderBy: { rankIndex: "asc" },
    });

    for (const [index, candidate] of createdCandidates.entries()) {
      const bundleEntry = scoredBundles[index];
      if (!bundleEntry) {
        continue;
      }

      await this.prisma.bundleCandidateItem.createMany({
        data: bundleEntry.bundle.items
          .filter((item) => item.listing)
          .map((item) => ({
            bundleCandidateId: candidate.id,
            requestedSlotKey: item.slot.slotKey,
            listingId: item.listing!.id,
            lenderId: item.listing!.lenderId,
            quantity: item.slot.quantity,
            contributionScores: {
              price: item.estimatedPrice,
              distanceKm: item.distanceKm,
              reliability: item.reliabilityScore,
              quality: item.qualityScore,
              availability: item.availabilityFitScore,
            } as any,
          })),
      });
    }

    const resultsPayload = await this.getResults(searchRequest.id);

    await this.prisma.bundleSearchRequest.update({
      where: { id: searchRequest.id },
      data: {
        status: "READY",
        resultsSnapshot: resultsPayload as any,
        debugSnapshot: {
          candidateCounts: counts,
          timings: {
            candidateFetchMs,
            bundleGenerationMs,
            scoringMs,
          },
          weights,
        } as any,
      },
    });

    await this.redisService.set(cacheKey, JSON.stringify(resultsPayload), 120);
    return resultsPayload;
  }

  async getSearch(id: string) {
    const search = await this.prisma.bundleSearchRequest.findUnique({
      where: { id },
    });

    if (!search) {
      throw new NotFoundException("Bundle search not found");
    }

    return normalizeDecimalObject(search);
  }

  async getResults(id: string) {
    const search = await this.prisma.bundleSearchRequest.findUnique({
      where: { id },
      include: {
        candidates: {
          include: {
            items: {
              include: {
                listing: {
                  include: {
                    category: true,
                    media: {
                      orderBy: { sortOrder: "asc" },
                    },
                  },
                },
              },
            },
          },
          orderBy: { rankIndex: "asc" },
        },
      },
    });

    if (!search) {
      throw new NotFoundException("Bundle search not found");
    }

    const normalizedSearch = normalizeDecimalObject(search);
    const bundles = normalizedSearch.candidates.map((candidate: any) => ({
      id: candidate.id,
      label: candidate.label,
      overallScore: decimalToNumber(candidate.scoreTotal),
      scores: {
        price: decimalToNumber(candidate.priceScore),
        reliability: decimalToNumber(candidate.reliabilityScore),
        logistics: decimalToNumber(candidate.logisticsScore),
        availability: decimalToNumber(candidate.availabilityScore),
        quality: decimalToNumber(candidate.productQualityScore),
        stability: decimalToNumber(candidate.stabilityScore),
      },
      explanation: candidate.explanation,
      pickupPointsCount: candidate.pickupPointsCount,
      totalEstimatedDistanceKm: decimalToNumber(candidate.totalDistanceKm),
      totalBundlePrice: decimalToNumber(candidate.totalPrice),
      exactAvailabilityFit: candidate.exactAvailabilityFit,
      includedItems: candidate.items.map((item: any) => ({
        slotKey: item.requestedSlotKey,
        listingId: item.listingId,
        listingTitleHe: item.listing.titleHe,
        listingTitleEn: item.listing.titleEn,
        categoryNameHe: item.listing.category.nameHe,
        priceContribution: item.contributionScores.price,
        media: item.listing.media,
      })),
    }));

    return {
      searchId: normalizedSearch.id,
      requestedItems: normalizedSearch.requestedItems,
      topRankedBundles: bundles.slice(0, 3),
      alternateBundles: bundles.slice(3),
      labels: {
        bestBalanced: bundles.find((bundle: any) => bundle.label === "best-balanced")?.id ?? bundles[0]?.id,
        bestPrice: bundles.find((bundle: any) => bundle.label === "best-price")?.id,
        easiestPickup: bundles.find((bundle: any) => bundle.label === "easiest-pickup")?.id,
        mostReliable: bundles.find((bundle: any) => bundle.label === "most-reliable")?.id,
      },
      observability: normalizedSearch.debugSnapshot,
    };
  }

  async recompute(id: string) {
    const search = await this.prisma.bundleSearchRequest.findUnique({
      where: { id },
    });

    if (!search) {
      throw new NotFoundException("Bundle search not found");
    }

    await this.prisma.bundleCandidateItem.deleteMany({
      where: { bundleCandidate: { searchRequestId: id } },
    });
    await this.prisma.bundleCandidate.deleteMany({
      where: { searchRequestId: id },
    });

    return this.create(
      {
        requestedItems: search.requestedItems as any,
        dateRange: {
          startDate: search.dateRangeStart.toISOString(),
          endDate: search.dateRangeEnd.toISOString(),
        },
        renterLocation: {
          lat: Number(search.renterLocationLat),
          lng: Number(search.renterLocationLng),
          addressText: search.renterAddressText,
        },
        preferenceProfile: (search.weightPreferences as any).preferenceProfile,
        weights: (search.weightPreferences as any).weights,
        maxBudget: decimalToNumber(search.maxBudget) ?? undefined,
        maxPickupPoints: search.maxPickupPoints ?? undefined,
        sameLenderPreferred: search.sameLenderPreferred,
        deliveryPreferred: search.deliveryPreferred,
        exactDatesOnly: search.exactDatesOnly,
        debug: true,
      },
      search.renterId ?? undefined,
    );
  }

  async debugSearch(id: string) {
    const search = await this.prisma.bundleSearchRequest.findUnique({
      where: { id },
      include: {
        candidates: {
          include: {
            items: true,
          },
          orderBy: { rankIndex: "asc" },
        },
      },
    });

    if (!search) {
      throw new NotFoundException("Bundle search not found");
    }

    return normalizeDecimalObject(search);
  }

  private buildCacheKey(input: BundleSearchInput) {
    const normalized = JSON.stringify({
      ...input,
      requestedItems: [...input.requestedItems].sort((a, b) => a.slotKey.localeCompare(b.slotKey)),
    });

    return `bundle-search:${createHash("sha256").update(normalized).digest("hex")}`;
  }

  private selectCuratedBundles(entries: Array<{ scores: { finalScore: number; priceScore: number; logisticsScore: number; reliabilityScore: number } }>) {
    const bestBalanced = 0;
    let bestPrice = 0;
    let easiestPickup = 0;
    let mostReliable = 0;

    entries.forEach((entry, index) => {
      if (entry.scores.priceScore > entries[bestPrice].scores.priceScore) {
        bestPrice = index;
      }
      if (entry.scores.logisticsScore > entries[easiestPickup].scores.logisticsScore) {
        easiestPickup = index;
      }
      if (entry.scores.reliabilityScore > entries[mostReliable].scores.reliabilityScore) {
        mostReliable = index;
      }
    });

    return { bestBalanced, bestPrice, easiestPickup, mostReliable };
  }
}
