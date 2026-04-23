"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleSearchService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const prisma_service_1 = require("../../prisma/prisma.service");
const redis_service_1 = require("../../shared/redis/redis.service");
const bundle_explanation_service_1 = require("./bundle-explanation.service");
const bundle_generation_service_1 = require("./bundle-generation.service");
const ranking_config_service_1 = require("./ranking-config.service");
const bundle_scoring_service_1 = require("./bundle-scoring.service");
let BundleSearchService = class BundleSearchService {
    prisma;
    redisService;
    rankingConfigService;
    generationService;
    scoringService;
    explanationService;
    constructor(prisma, redisService, rankingConfigService, generationService, scoringService, explanationService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.rankingConfigService = rankingConfigService;
        this.generationService = generationService;
        this.scoringService = scoringService;
        this.explanationService = explanationService;
    }
    async create(input, renterId) {
        const cacheKey = this.buildCacheKey(input);
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const weights = await this.rankingConfigService.resolveWeights(input);
        const searchRequest = await this.prisma.bundleSearchRequest.create({
            data: {
                renterId,
                searchSessionId: (0, node_crypto_1.randomUUID)(),
                dateRangeStart: new Date(input.dateRange.startDate),
                dateRangeEnd: new Date(input.dateRange.endDate),
                requestedItems: input.requestedItems,
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
                id: (0, node_crypto_1.randomUUID)(),
                searchRequestId: searchRequest.id,
                scoreTotal: entry.scores.finalScore,
                priceScore: entry.scores.priceScore,
                reliabilityScore: entry.scores.reliabilityScore,
                logisticsScore: entry.scores.logisticsScore,
                availabilityScore: entry.scores.availabilityScore,
                productQualityScore: entry.scores.productQualityScore,
                stabilityScore: entry.scores.stabilityScore,
                explanation: entry.explanation,
                debugData: {
                    timings: {
                        candidateFetchMs,
                        bundleGenerationMs,
                        scoringMs,
                    },
                    penalties: entry.scores.stability,
                    weights,
                },
                totalPrice: entry.bundle.totalPrice,
                totalDistanceKm: entry.bundle.totalDistanceKm,
                pickupPointsCount: entry.bundle.pickupPointsCount,
                lendersCount: entry.bundle.lendersCount,
                exactAvailabilityFit: entry.bundle.exactAvailabilityFit,
                rankIndex: index,
                label: curatedIds.bestBalanced === index
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
                    listingId: item.listing.id,
                    lenderId: item.listing.lenderId,
                    quantity: item.slot.quantity,
                    contributionScores: {
                        price: item.estimatedPrice,
                        distanceKm: item.distanceKm,
                        reliability: item.reliabilityScore,
                        quality: item.qualityScore,
                        availability: item.availabilityFitScore,
                    },
                })),
            });
        }
        const resultsPayload = await this.getResults(searchRequest.id);
        await this.prisma.bundleSearchRequest.update({
            where: { id: searchRequest.id },
            data: {
                status: "READY",
                resultsSnapshot: resultsPayload,
                debugSnapshot: {
                    candidateCounts: counts,
                    timings: {
                        candidateFetchMs,
                        bundleGenerationMs,
                        scoringMs,
                    },
                    weights,
                },
            },
        });
        await this.redisService.set(cacheKey, JSON.stringify(resultsPayload), 120);
        return resultsPayload;
    }
    async getSearch(id) {
        const search = await this.prisma.bundleSearchRequest.findUnique({
            where: { id },
        });
        if (!search) {
            throw new common_1.NotFoundException("Bundle search not found");
        }
        return (0, prisma_utils_1.normalizeDecimalObject)(search);
    }
    async getResults(id) {
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
            throw new common_1.NotFoundException("Bundle search not found");
        }
        const normalizedSearch = (0, prisma_utils_1.normalizeDecimalObject)(search);
        const bundles = normalizedSearch.candidates.map((candidate) => ({
            id: candidate.id,
            label: candidate.label,
            overallScore: (0, prisma_utils_1.decimalToNumber)(candidate.scoreTotal),
            scores: {
                price: (0, prisma_utils_1.decimalToNumber)(candidate.priceScore),
                reliability: (0, prisma_utils_1.decimalToNumber)(candidate.reliabilityScore),
                logistics: (0, prisma_utils_1.decimalToNumber)(candidate.logisticsScore),
                availability: (0, prisma_utils_1.decimalToNumber)(candidate.availabilityScore),
                quality: (0, prisma_utils_1.decimalToNumber)(candidate.productQualityScore),
                stability: (0, prisma_utils_1.decimalToNumber)(candidate.stabilityScore),
            },
            explanation: candidate.explanation,
            pickupPointsCount: candidate.pickupPointsCount,
            totalEstimatedDistanceKm: (0, prisma_utils_1.decimalToNumber)(candidate.totalDistanceKm),
            totalBundlePrice: (0, prisma_utils_1.decimalToNumber)(candidate.totalPrice),
            exactAvailabilityFit: candidate.exactAvailabilityFit,
            includedItems: candidate.items.map((item) => ({
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
                bestBalanced: bundles.find((bundle) => bundle.label === "best-balanced")?.id ?? bundles[0]?.id,
                bestPrice: bundles.find((bundle) => bundle.label === "best-price")?.id,
                easiestPickup: bundles.find((bundle) => bundle.label === "easiest-pickup")?.id,
                mostReliable: bundles.find((bundle) => bundle.label === "most-reliable")?.id,
            },
            observability: normalizedSearch.debugSnapshot,
        };
    }
    async recompute(id) {
        const search = await this.prisma.bundleSearchRequest.findUnique({
            where: { id },
        });
        if (!search) {
            throw new common_1.NotFoundException("Bundle search not found");
        }
        await this.prisma.bundleCandidateItem.deleteMany({
            where: { bundleCandidate: { searchRequestId: id } },
        });
        await this.prisma.bundleCandidate.deleteMany({
            where: { searchRequestId: id },
        });
        return this.create({
            requestedItems: search.requestedItems,
            dateRange: {
                startDate: search.dateRangeStart.toISOString(),
                endDate: search.dateRangeEnd.toISOString(),
            },
            renterLocation: {
                lat: Number(search.renterLocationLat),
                lng: Number(search.renterLocationLng),
                addressText: search.renterAddressText,
            },
            preferenceProfile: search.weightPreferences.preferenceProfile,
            weights: search.weightPreferences.weights,
            maxBudget: (0, prisma_utils_1.decimalToNumber)(search.maxBudget) ?? undefined,
            maxPickupPoints: search.maxPickupPoints ?? undefined,
            sameLenderPreferred: search.sameLenderPreferred,
            deliveryPreferred: search.deliveryPreferred,
            exactDatesOnly: search.exactDatesOnly,
            debug: true,
        }, search.renterId ?? undefined);
    }
    async debugSearch(id) {
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
            throw new common_1.NotFoundException("Bundle search not found");
        }
        return (0, prisma_utils_1.normalizeDecimalObject)(search);
    }
    buildCacheKey(input) {
        const normalized = JSON.stringify({
            ...input,
            requestedItems: [...input.requestedItems].sort((a, b) => a.slotKey.localeCompare(b.slotKey)),
        });
        return `bundle-search:${(0, node_crypto_1.createHash)("sha256").update(normalized).digest("hex")}`;
    }
    selectCuratedBundles(entries) {
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
};
exports.BundleSearchService = BundleSearchService;
exports.BundleSearchService = BundleSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        ranking_config_service_1.RankingConfigService,
        bundle_generation_service_1.BundleGenerationService,
        bundle_scoring_service_1.BundleScoringService,
        bundle_explanation_service_1.BundleExplanationService])
], BundleSearchService);
//# sourceMappingURL=bundle-search.service.js.map