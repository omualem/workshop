"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeStabilityAdjustedScore = exports.stdDev = exports.mean = exports.clampScore = void 0;
const config_1 = require("@rental/config");
const clampScore = (value) => Math.max(config_1.RANKING_SCORE_MIN, Math.min(config_1.RANKING_SCORE_MAX, value));
exports.clampScore = clampScore;
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
exports.mean = mean;
const stdDev = (values) => {
    const avg = (0, exports.mean)(values);
    const variance = (0, exports.mean)(values.map((value) => (value - avg) ** 2));
    return Math.sqrt(variance);
};
exports.stdDev = stdDev;
const computeStabilityAdjustedScore = (scores, weights) => {
    const values = Object.values(scores);
    const weightedMean = scores.price * weights.price +
        scores.reliability * weights.reliability +
        scores.logistics * weights.logistics +
        scores.availability * weights.availability +
        scores.quality * weights.quality;
    const variation = (0, exports.stdDev)(values);
    const imbalancePenalty = variation * config_1.RANKING_STD_DEV_ALPHA;
    const weakEntries = Object.entries(scores).filter(([, score]) => score < config_1.RANKING_LOW_SCORE_THRESHOLD);
    const lowScorePenalty = weakEntries.reduce((sum, [, score]) => sum + (config_1.RANKING_LOW_SCORE_THRESHOLD - score), 0) *
        config_1.RANKING_LOW_SCORE_BETA;
    const bottleneckAdjustment = Math.min(...values) * config_1.RANKING_BOTTLENECK_GAMMA;
    const finalScore = (0, exports.clampScore)(weightedMean - imbalancePenalty - lowScorePenalty + bottleneckAdjustment);
    return {
        weightedMean,
        stdDev: variation,
        imbalancePenalty,
        lowScorePenalty,
        bottleneckAdjustment,
        finalScore,
        weakDimensions: weakEntries.map(([dimension]) => dimension),
    };
};
exports.computeStabilityAdjustedScore = computeStabilityAdjustedScore;
//# sourceMappingURL=math.js.map