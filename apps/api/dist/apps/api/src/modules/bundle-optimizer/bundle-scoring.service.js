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
exports.BundleScoringService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@rental/utils");
const metric_normalization_service_1 = require("./metric-normalization.service");
const LOW_SCORE_THRESHOLDS = {
    price: 4.0,
    distance: 4.0,
    reliability: 6.5,
    condition: 6.5,
    availability: 7.0,
};
const LOW_SCORE_WEIGHTS = {
    price: 0.25,
    distance: 0.35,
    reliability: 0.65,
    condition: 0.7,
    availability: 0.8,
};
let BundleScoringService = class BundleScoringService {
    normalization;
    constructor(normalization) {
        this.normalization = normalization;
    }
    calculateBundleMetrics(bundle, budget, alphaDistanceMix) {
        const items = bundle.items;
        const distances = items.map((i) => i.distanceKm);
        const avgDistance = this.normalization.mean(distances);
        const maxDistance = distances.length ? Math.max(...distances) : 0;
        const m_distance = this.normalization.bundleDistanceScore(avgDistance, maxDistance, alphaDistanceMix);
        const m_availability = Math.min(...items.map((i) => i.m_availability));
        const m_reliability = this.normalization.mean(items.map((i) => i.m_reliability));
        const conditionScores = items.map((i) => i.m_condition);
        const conditionAvg = this.normalization.mean(conditionScores);
        const conditionMin = conditionScores.length ? Math.min(...conditionScores) : 0;
        const m_condition = 0.6 * conditionAvg + 0.4 * conditionMin;
        const metrics = {
            price: this.normalization.bundlePriceScore(bundle.totalPrice, budget),
            distance: m_distance,
            reliability: m_reliability,
            condition: m_condition,
            availability: m_availability,
        };
        const pickupCost = this.calculatePickupCost(items);
        const derived = {
            avgDistance,
            maxDistance,
            pickupCost,
            pickupStops: bundle.uniquePickupCount,
            deviationDaysSum: items.reduce((s, i) => s + i.deviationDays, 0),
        };
        return { metrics, derived };
    }
    calculateWeightedUtility(metrics, weights) {
        return (weights.price * metrics.price +
            weights.distance * metrics.distance +
            weights.reliability * metrics.reliability +
            weights.condition * metrics.condition +
            weights.availability * metrics.availability);
    }
    variance(values) {
        if (values.length === 0)
            return 0;
        const mean = values.reduce((s, v) => s + v, 0) / values.length;
        return values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
    }
    calculateVariancePenalty(metrics, lambda) {
        return lambda * this.variance(this.metricVector(metrics));
    }
    calculateBottleneckTerm(metrics, alpha) {
        return alpha * Math.min(...this.metricVector(metrics));
    }
    calculatePickupCost(items) {
        const uniquePickups = new Map();
        for (const item of items) {
            if (!uniquePickups.has(item.pickupKey)) {
                uniquePickups.set(item.pickupKey, { lat: item.pickupLat, lng: item.pickupLng });
            }
        }
        const points = [...uniquePickups.values()];
        let total = 0;
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                total += (0, utils_1.haversineDistanceKm)(points[i], points[j]);
            }
        }
        return total;
    }
    calculatePickupComplexityPenalty(bundle, pickupCostKm, beta) {
        const spatial = this.normalization.normalizePickupCost(pickupCostKm);
        const countOverhead = Math.max(0, bundle.uniquePickupCount - 1);
        return beta * (spatial + countOverhead);
    }
    calculateMaxDistancePenalty(maxDistanceKm, gamma) {
        return this.normalization.maxDistancePenalty(maxDistanceKm, gamma);
    }
    calculateLowScorePenalty(metrics, multipliers = {
        price: 1,
        distance: 1,
        reliability: 1,
        condition: 1,
        availability: 1,
    }) {
        const breakdown = {
            price: LOW_SCORE_WEIGHTS.price * multipliers.price * Math.max(0, LOW_SCORE_THRESHOLDS.price - metrics.price),
            distance: LOW_SCORE_WEIGHTS.distance * multipliers.distance * Math.max(0, LOW_SCORE_THRESHOLDS.distance - metrics.distance),
            reliability: LOW_SCORE_WEIGHTS.reliability * multipliers.reliability * Math.max(0, LOW_SCORE_THRESHOLDS.reliability - metrics.reliability),
            condition: LOW_SCORE_WEIGHTS.condition * multipliers.condition * Math.max(0, LOW_SCORE_THRESHOLDS.condition - metrics.condition),
            availability: LOW_SCORE_WEIGHTS.availability * multipliers.availability * Math.max(0, LOW_SCORE_THRESHOLDS.availability - metrics.availability),
        };
        const total = breakdown.price +
            breakdown.distance +
            breakdown.reliability +
            breakdown.condition +
            breakdown.availability;
        return { total, breakdown };
    }
    calculateFinalScore(bundle, prefs, budget, resolvedPreferences = fallbackResolvedPreferences(prefs)) {
        const { metrics, derived } = this.calculateBundleMetrics(bundle, budget, prefs.alphaDistanceMix);
        const weightedUtility = this.calculateWeightedUtility(metrics, prefs.weights);
        const variancePenalty = this.calculateVariancePenalty(metrics, prefs.lambdaVariance * resolvedPreferences.penaltyWeights.variance);
        const bottleneckTerm = this.calculateBottleneckTerm(metrics, prefs.alphaBottleneck * resolvedPreferences.penaltyWeights.bottleneck);
        const pickupPenalty = this.calculatePickupComplexityPenalty(bundle, derived.pickupCost, prefs.betaPickup * resolvedPreferences.penaltyWeights.pickup);
        const maxDistancePenalty = this.calculateMaxDistancePenalty(derived.maxDistance, prefs.gammaMaxDistance * resolvedPreferences.penaltyWeights.maxDistance);
        const { total: lowScorePenalty, breakdown: lowScorePenaltyBreakdown } = this.calculateLowScorePenalty(metrics, resolvedPreferences.penaltyWeights.lowScore);
        const rawFinalScore = weightedUtility -
            variancePenalty +
            bottleneckTerm -
            pickupPenalty -
            maxDistancePenalty -
            lowScorePenalty;
        const finalScore = this.normalization.clamp(rawFinalScore, 0, 10);
        const breakdown = {
            weightedUtility,
            variancePenalty,
            bottleneckTerm,
            pickupPenalty,
            maxDistancePenalty,
            lowScorePenalty,
            lowScorePenaltyBreakdown,
            preferences: {
                profile: resolvedPreferences.profile,
                baseProfile: resolvedPreferences.baseProfile,
                sliders: resolvedPreferences.sliders,
                normalizedWeights: resolvedPreferences.weights,
                penaltyMultipliers: resolvedPreferences.penaltyWeights,
            },
            rawFinalScore,
            finalScore,
        };
        return { bundle, metrics, derived, breakdown };
    }
    partialScore(items, prefs, budget) {
        if (items.length === 0)
            return 0;
        const totalPrice = items.reduce((s, i) => s + i.price, 0);
        const distances = items.map((i) => i.distanceKm);
        const avgDistance = this.normalization.mean(distances);
        const maxDistance = Math.max(...distances);
        const partialMetrics = {
            price: this.normalization.bundlePriceScore(totalPrice, budget),
            distance: this.normalization.bundleDistanceScore(avgDistance, maxDistance, prefs.alphaDistanceMix),
            reliability: this.normalization.mean(items.map((i) => i.m_reliability)),
            condition: this.normalization.mean(items.map((i) => i.m_condition)),
            availability: Math.min(...items.map((i) => i.m_availability)),
        };
        return (this.calculateWeightedUtility(partialMetrics, prefs.weights) -
            this.calculateVariancePenalty(partialMetrics, prefs.lambdaVariance));
    }
    metricVector(m) {
        return [m.price, m.distance, m.reliability, m.condition, m.availability];
    }
};
exports.BundleScoringService = BundleScoringService;
exports.BundleScoringService = BundleScoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metric_normalization_service_1.MetricNormalizationService])
], BundleScoringService);
function fallbackResolvedPreferences(prefs) {
    return {
        profile: "balanced",
        sliders: {
            price: 7,
            distance: 7,
            reliability: 7,
            condition: 7,
            availability: 7,
            pickupSimplicity: 7,
        },
        weights: prefs.weights,
        penaltyWeights: {
            pickup: 1,
            lowScore: {
                price: 1,
                distance: 1,
                reliability: 1,
                condition: 1,
                availability: 1,
            },
            maxDistance: 1,
            variance: 1,
            bottleneck: 1,
        },
    };
}
//# sourceMappingURL=bundle-scoring.service.js.map