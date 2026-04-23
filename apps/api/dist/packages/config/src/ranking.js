"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RANKING_PRESETS = exports.RANKING_SCORE_MAX = exports.RANKING_SCORE_MIN = exports.RANKING_BOTTLENECK_GAMMA = exports.RANKING_LOW_SCORE_BETA = exports.RANKING_STD_DEV_ALPHA = exports.RANKING_LOW_SCORE_THRESHOLD = void 0;
exports.RANKING_LOW_SCORE_THRESHOLD = 5.2;
exports.RANKING_STD_DEV_ALPHA = 0.35;
exports.RANKING_LOW_SCORE_BETA = 0.6;
exports.RANKING_BOTTLENECK_GAMMA = 0.28;
exports.RANKING_SCORE_MIN = 0;
exports.RANKING_SCORE_MAX = 10;
exports.DEFAULT_RANKING_PRESETS = {
    balanced: {
        price: 0.2,
        reliability: 0.2,
        logistics: 0.2,
        availability: 0.2,
        quality: 0.2,
    },
    cheapest: {
        price: 0.42,
        reliability: 0.16,
        logistics: 0.18,
        availability: 0.14,
        quality: 0.1,
    },
    mostReliable: {
        price: 0.1,
        reliability: 0.38,
        logistics: 0.15,
        availability: 0.16,
        quality: 0.21,
    },
    easiestPickup: {
        price: 0.1,
        reliability: 0.16,
        logistics: 0.42,
        availability: 0.16,
        quality: 0.16,
    },
    bestDateFit: {
        price: 0.12,
        reliability: 0.14,
        logistics: 0.14,
        availability: 0.42,
        quality: 0.18,
    },
};
//# sourceMappingURL=ranking.js.map