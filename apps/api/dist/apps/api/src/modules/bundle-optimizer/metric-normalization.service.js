"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricNormalizationService = void 0;
const common_1 = require("@nestjs/common");
let MetricNormalizationService = class MetricNormalizationService {
    clamp(value, lo = 0, hi = 10) {
        if (Number.isNaN(value))
            return lo;
        return Math.max(lo, Math.min(hi, value));
    }
    normalizePriceScore(price, minPrice, maxPrice) {
        if (maxPrice <= minPrice)
            return 10;
        return this.clamp(10 * (maxPrice - price) / (maxPrice - minPrice));
    }
    normalizeDistanceScore(distanceKm) {
        return this.clamp(10 * Math.exp(-Math.max(0, distanceKm) / 30));
    }
    normalizeReliabilityScore(reliability) {
        return this.clamp(reliability);
    }
    normalizeConditionScore(condition) {
        const table = {
            NEW: 10,
            LIKE_NEW: 9,
            GOOD: 7.5,
            FAIR: 5,
            HEAVY_USE: 2,
        };
        return this.clamp(table[condition] ?? 5);
    }
    normalizeAvailabilityScore(availability) {
        return this.clamp(availability);
    }
    bundlePriceScore(totalPrice, budget) {
        if (budget <= 0)
            return 0;
        return this.clamp(10 * (1 - totalPrice / budget));
    }
    mean(values) {
        if (values.length === 0)
            return 0;
        return values.reduce((sum, v) => sum + v, 0) / values.length;
    }
    availabilityFromDeviation(deviationDays) {
        return this.clamp(10 - 2 * Math.max(0, deviationDays));
    }
    bundleDistanceScore(avgDistanceKm, maxDistanceKm, alphaMix) {
        const D = alphaMix * avgDistanceKm + (1 - alphaMix) * maxDistanceKm;
        return this.clamp(10 * Math.exp(-Math.max(0, D) / 30));
    }
    maxDistancePenalty(maxDistanceKm, gamma) {
        return gamma * (1 - Math.exp(-Math.max(0, maxDistanceKm) / 30));
    }
    normalizePickupCost(pickupCostKm) {
        return Math.max(0, pickupCostKm) / 25;
    }
};
exports.MetricNormalizationService = MetricNormalizationService;
exports.MetricNormalizationService = MetricNormalizationService = __decorate([
    (0, common_1.Injectable)()
], MetricNormalizationService);
//# sourceMappingURL=metric-normalization.service.js.map