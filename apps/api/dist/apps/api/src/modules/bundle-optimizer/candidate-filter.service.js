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
const lender_reliability_service_1 = require("../bundle-search/lender-reliability.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const metric_normalization_service_1 = require("./metric-normalization.service");
const CONDITION_ORDER = ["HEAVY_USE", "FAIR", "GOOD", "LIKE_NEW", "NEW"];
const PREFERRED_LISTING_BONUS = 0.5;
let CandidateFilterService = class CandidateFilterService {
    prisma;
    availability;
    pricing;
    reliability;
    normalization;
    constructor(prisma, availability, pricing, reliability, normalization) {
        this.prisma = prisma;
        this.availability = availability;
        this.pricing = pricing;
        this.reliability = reliability;
        this.normalization = normalization;
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
        for (const slot of expandedSlots) {
            const constraints = this.normalizeConstraints(slot);
            const rawListings = await this.loadSlotListings(slot);
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
                const distanceKm = (0, utils_1.haversineDistanceKm)({ lat: req.userLocation.lat, lng: req.userLocation.lng }, { lat: pickupLat, lng: pickupLng });
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
                if (!this.meetsConditionFloor(listing.condition, constraints.minCondition)) {
                    continue;
                }
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
                const reliability = this.reliability.compute({
                    averageRating: (0, prisma_utils_1.decimalToNumber)(listing.lender.averageRating) ?? 0,
                    completedTransactionsCount: listing.lender.completedTransactionsCount,
                    cancellationRate: (0, prisma_utils_1.decimalToNumber)(listing.lender.cancellationRate) ?? 0,
                    lateReturnRate: (0, prisma_utils_1.decimalToNumber)(listing.lender.lateReturnRate) ?? 0,
                    complaintRate: (0, prisma_utils_1.decimalToNumber)(listing.lender.complaintRate) ?? 0,
                    verificationLevel: listing.lender.verificationLevel,
                    responseTimeScore: (0, prisma_utils_1.decimalToNumber)(listing.lender.responseTimeScore) ?? 5,
                });
                const conditionScore = this.normalization.normalizeConditionScore(listing.condition);
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
                    condition: listing.condition,
                    price: priceQuote.total,
                    distanceKm,
                    reliability,
                    conditionScore,
                    availability: availabilityScore,
                    pickupLat,
                    pickupLng,
                    inventoryCount: listing.inventoryCount,
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
                    m_condition: 0,
                    m_availability: 0,
                    preliminaryScore: 0,
                });
            }
            afterFiltering[slot.slotKey] = survivors.length;
            const minPrice = Math.min(...survivors.map((c) => c.price), Infinity);
            const maxPrice = Math.max(...survivors.map((c) => c.price), 0);
            for (const c of survivors) {
                c.m_price = this.normalization.normalizePriceScore(c.price, minPrice, maxPrice);
                c.m_distance = this.normalization.normalizeDistanceScore(c.distanceKm);
                c.m_reliability = this.normalization.normalizeReliabilityScore(c.reliability);
                c.m_condition = this.normalization.normalizeConditionScore(c.condition);
                c.m_availability = this.normalization.normalizeAvailabilityScore(c.availability);
                const w = req.preferences.weights;
                c.preliminaryScore =
                    w.price * c.m_price +
                        w.distance * c.m_distance +
                        w.reliability * c.m_reliability +
                        w.condition * c.m_condition +
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
    async loadSlotListings(slot) {
        const include = {
            lender: true,
            pricingRules: true,
            attributeValues: true,
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
                    NOT: { id: chosen.id },
                },
                include,
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
            where: { categoryId: slot.categoryId, status: "ACTIVE" },
            include,
        });
    }
    normalizeConstraints(slot) {
        const c = { ...(slot.constraints ?? {}) };
        if (c.minCondition === undefined && slot.minCondition !== undefined) {
            c.minCondition = slot.minCondition;
        }
        return c;
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
    meetsConditionFloor(actual, floor) {
        if (!floor)
            return true;
        return CONDITION_ORDER.indexOf(actual) >= CONDITION_ORDER.indexOf(floor);
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
        metric_normalization_service_1.MetricNormalizationService])
], CandidateFilterService);
//# sourceMappingURL=candidate-filter.service.js.map