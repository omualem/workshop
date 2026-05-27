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
exports.CandidateFilterService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@rental/utils");
const prisma_service_1 = require("../../prisma/prisma.service");
const availability_service_1 = require("../availability/availability.service");
const pricing_service_1 = require("../pricing/pricing.service");
const lender_reliability_service_1 = require("./lender-reliability.service");
const listing_rating_service_1 = require("./listing-rating.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const metric_normalization_service_1 = require("./metric-normalization.service");
const ROUGH_PREFILTER_POOL_SIZE = 100;
const RELIABILITY_THETA = 0.7;
const PREFERRED_LISTING_BONUS = 0.5;
let CandidateFilterService = class CandidateFilterService {
    prisma;
    availability;
    pricing;
    reliability;
    normalization;
    listingRating;
    constructor(prisma, availability, pricing, reliability, normalization, listingRating) {
        this.prisma = prisma;
        this.availability = availability;
        this.pricing = pricing;
        this.reliability = reliability;
        this.normalization = normalization;
        this.listingRating = listingRating;
    }
    async buildCandidatesPerSlot(req) {
        const candidatesBySlot = {};
        const beforeFiltering = {};
        const afterFiltering = {};
        const afterTopK = {};
        const filteredByAvailability = {};
        const filteredByRentalDays = {};
        const filteredByDistance = {};
        const slotDebug = {};
        const startDate = new Date(req.dateRange.startDate);
        const endDate = new Date(req.dateRange.endDate);
        const durationDays = this.computeDurationDays(startDate, endDate);
        const expandedSlots = [];
        for (const slot of req.slots) {
            const q = Math.max(1, slot.quantity ?? 1);
            if (q === 1) {
                expandedSlots.push(slot);
            }
            else {
                for (let i = 1; i <= q; i++) {
                    expandedSlots.push({
                        ...slot,
                        slotKey: `${slot.slotKey}::${i}`,
                        quantity: 1,
                    });
                }
            }
        }
        const ratingAggregateCache = new Map();
        for (const slot of expandedSlots) {
            const constraints = this.normalizeConstraints(slot);
            const rawListings = await this.loadSlotListings(slot, constraints);
            await this.primeRatingAggregates(rawListings.map((l) => l.id), ratingAggregateCache);
            beforeFiltering[slot.slotKey] = rawListings.length;
            filteredByAvailability[slot.slotKey] = 0;
            filteredByRentalDays[slot.slotKey] = 0;
            filteredByDistance[slot.slotKey] = 0;
            slotDebug[slot.slotKey] = [];
            const preferredListingId = slot.mode === "specificListing" ? slot.specificListingId : undefined;
            const survivors = [];
            for (const listing of rawListings) {
                const pickupLat = (0, prisma_utils_1.decimalToNumber)(listing.pickupLat) ?? 0;
                const pickupLng = (0, prisma_utils_1.decimalToNumber)(listing.pickupLng) ?? 0;
                const distanceKm = (0, utils_1.haversineDistanceKm)({ lat: req.userLocation.lat ?? 0, lng: req.userLocation.lng ?? 0 }, { lat: pickupLat, lng: pickupLng });
                const entryDebug = {
                    listingId: listing.id,
                    titleHe: listing.titleHe,
                    distanceKm,
                    availability: false,
                    durationDays,
                    minRentalDays: listing.minRentalDays,
                    maxRentalDays: listing.maxRentalDays,
                };
                if (listing.status !== "ACTIVE")
                    continue;
                if (durationDays < listing.minRentalDays ||
                    durationDays > listing.maxRentalDays) {
                    filteredByRentalDays[slot.slotKey] += 1;
                    entryDebug.filteredOutBy = "rentalDays";
                    slotDebug[slot.slotKey].push(entryDebug);
                    continue;
                }
                const isAvailable = await this.availability.isListingAvailable(listing.id, slot.quantity ?? 1, startDate, endDate, listing.inventoryCount);
                entryDebug.availability = isAvailable;
                if (!isAvailable) {
                    filteredByAvailability[slot.slotKey] += 1;
                    entryDebug.filteredOutBy = "availability";
                    slotDebug[slot.slotKey].push(entryDebug);
                    continue;
                }
                const priceQuote = this.pricing.computeListingPrice(listing, startDate, endDate, slot.quantity ?? 1);
                if (priceQuote.total > req.budget)
                    continue;
                if (constraints.maxPrice !== undefined &&
                    priceQuote.total > constraints.maxPrice) {
                    continue;
                }
                if (constraints.minPrice !== undefined &&
                    priceQuote.total < constraints.minPrice) {
                    continue;
                }
                if (constraints.maxDistanceKm !== undefined &&
                    distanceKm > constraints.maxDistanceKm) {
                    filteredByDistance[slot.slotKey] += 1;
                    entryDebug.filteredOutBy = "distance";
                    slotDebug[slot.slotKey].push(entryDebug);
                    continue;
                }
                slotDebug[slot.slotKey].push(entryDebug);
                const reliabilityOverride = (0, prisma_utils_1.decimalToNumber)(listing.lender.reliabilityScoreCached) ?? 0;
                const lenderReliability = reliabilityOverride > 0
                    ? Math.max(0, Math.min(10, reliabilityOverride))
                    : this.reliability.compute({
                        averageRating: (0, prisma_utils_1.decimalToNumber)(listing.lender.averageRating) ?? 0,
                        completedTransactionsCount: listing.lender.completedTransactionsCount,
                        cancellationRate: (0, prisma_utils_1.decimalToNumber)(listing.lender.cancellationRate) ?? 0,
                        lateReturnRate: (0, prisma_utils_1.decimalToNumber)(listing.lender.lateReturnRate) ?? 0,
                        complaintRate: (0, prisma_utils_1.decimalToNumber)(listing.lender.complaintRate) ?? 0,
                        verificationLevel: listing.lender.verificationLevel,
                        responseTimeScore: (0, prisma_utils_1.decimalToNumber)(listing.lender.responseTimeScore) ?? 5,
                    });
                const aggregate = ratingAggregateCache.get(listing.id) ?? {
                    averageRating: 0,
                    distinctRaterCount: 0,
                };
                const itemRating = this.listingRating.compute(aggregate);
                const reliability = itemRating.itemRatingScore !== null
                    ? Math.max(0, Math.min(10, RELIABILITY_THETA * lenderReliability +
                        (1 - RELIABILITY_THETA) * itemRating.itemRatingScore))
                    : lenderReliability;
                const reliabilityBreakdown = {
                    lenderReliability,
                    itemAverageRating: itemRating.averageRating,
                    itemDistinctRatingCount: itemRating.distinctRaterCount,
                    itemRatingConfidence: itemRating.confidence,
                    adjustedItemRating: itemRating.adjustedRating,
                    itemRatingScore: itemRating.itemRatingScore,
                    insufficientRatingInfo: itemRating.insufficient,
                    finalReliabilityScore: reliability,
                };
                const deviationDays = await this.computeDeviationDays(listing.id, startDate, endDate);
                const availabilityScore = this.normalization.availabilityFromDeviation(deviationDays);
                survivors.push({
                    slotKey: slot.slotKey,
                    listingId: listing.id,
                    lenderId: listing.lenderId,
                    pickupKey: `${listing.lenderId}:${(0, prisma_utils_1.decimalToNumber)(listing.pickupLat)}:${(0, prisma_utils_1.decimalToNumber)(listing.pickupLng)}`,
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
                    lenderCompletedTransactions: listing.lender?.completedTransactionsCount ?? 0,
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
            const perSlotBudget = Math.max(1, req.budget / Math.max(1, expandedSlots.length));
            for (const c of survivors) {
                c.m_price = this.normalization.clamp(10 * (1 - c.price / perSlotBudget));
                c.m_distance = this.normalization.normalizeDistanceScore(c.distanceKm);
                c.m_reliability = this.normalization.normalizeReliabilityScore(c.reliability);
                c.m_availability = this.normalization.normalizeAvailabilityScore(c.availability);
                const w = req.preferences.weights;
                c.preliminaryScore =
                    w.price * c.m_price +
                        w.distance * c.m_distance +
                        w.reliability * c.m_reliability +
                        w.availability * c.m_availability;
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
    async loadSlotListings(slot, constraints) {
        const include = {
            lender: true,
            pricingRules: true,
            attributeValues: true,
        };
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
                if (!allowAlternatives)
                    return [];
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
            const seen = new Set([chosen.id]);
            const merged = [chosen];
            for (const alt of alternatives) {
                if (!seen.has(alt.id)) {
                    seen.add(alt.id);
                    merged.push(alt);
                }
            }
            return merged;
        }
        if (!slot.categoryId)
            return [];
        return this.prisma.listing.findMany({
            where: { categoryId: slot.categoryId, status: "ACTIVE", ...cheapPrefilter },
            include,
            orderBy: [{ basePriceDaily: "asc" }, { updatedAt: "desc" }],
            take: roughPoolSize,
        });
    }
    async primeRatingAggregates(listingIds, cache) {
        const missing = listingIds.filter((id) => !cache.has(id));
        if (missing.length === 0)
            return;
        const reviews = await this.prisma.review.findMany({
            where: { listingId: { in: missing } },
            select: { listingId: true, reviewerId: true, rating: true },
        });
        const grouped = new Map();
        for (const r of reviews) {
            if (!r.listingId)
                continue;
            let entry = grouped.get(r.listingId);
            if (!entry) {
                entry = { sum: 0, count: 0, reviewers: new Set() };
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
            }
            else {
                cache.set(id, {
                    averageRating: entry.sum / entry.count,
                    distinctRaterCount: entry.reviewers.size,
                });
            }
        }
    }
    normalizeConstraints(slot) {
        return { ...(slot.constraints ?? {}) };
    }
    async computeDeviationDays(listingId, startDate, endDate) {
        const blocks = await this.prisma.listingAvailabilityBlock.findMany({
            where: {
                listingId,
                startDate: { lt: endDate },
                endDate: { gt: startDate },
                status: { in: ["BLOCKED", "BOOKED", "MAINTENANCE"] },
            },
            select: { startDate: true, endDate: true },
        });
        if (blocks.length === 0)
            return 0;
        const dayMs = 24 * 60 * 60 * 1000;
        const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / dayMs));
        const touched = new Set();
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
    computeDurationDays(startDate, endDate) {
        const dayMs = 24 * 60 * 60 * 1000;
        return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / dayMs));
    }
    isSlotImpossible(candidates) {
        return candidates.length === 0;
    }
    findEmptySlot(slots, candidatesBySlot) {
        return slots.find((s) => (candidatesBySlot[s.slotKey] ?? []).length === 0);
    }
};
exports.CandidateFilterService = CandidateFilterService;
exports.CandidateFilterService = CandidateFilterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        availability_service_1.AvailabilityService,
        pricing_service_1.PricingService,
        lender_reliability_service_1.LenderReliabilityService,
        metric_normalization_service_1.MetricNormalizationService,
        listing_rating_service_1.ListingRatingService])
], CandidateFilterService);
//# sourceMappingURL=candidate-filter.service.js.map