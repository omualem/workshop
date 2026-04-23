"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePresetWeights = exports.normalizeWeights = void 0;
const config_1 = require("@rental/config");
const normalizeWeights = (weights) => {
    const total = weights.price +
        weights.reliability +
        weights.logistics +
        weights.availability +
        weights.quality;
    if (total <= 0) {
        return config_1.DEFAULT_RANKING_PRESETS.balanced;
    }
    return {
        price: weights.price / total,
        reliability: weights.reliability / total,
        logistics: weights.logistics / total,
        availability: weights.availability / total,
        quality: weights.quality / total,
    };
};
exports.normalizeWeights = normalizeWeights;
const resolvePresetWeights = (preferenceProfile, weights) => {
    if (preferenceProfile === "custom" && weights) {
        return (0, exports.normalizeWeights)(weights);
    }
    return (0, exports.normalizeWeights)(config_1.DEFAULT_RANKING_PRESETS[preferenceProfile] ?? config_1.DEFAULT_RANKING_PRESETS.balanced);
};
exports.resolvePresetWeights = resolvePresetWeights;
//# sourceMappingURL=weights.js.map