import type { RankingWeights } from "@rental/types";

export const RANKING_LOW_SCORE_THRESHOLD = 5.2;
export const RANKING_STD_DEV_ALPHA = 0.35;
export const RANKING_LOW_SCORE_BETA = 0.6;
export const RANKING_BOTTLENECK_GAMMA = 0.28;
export const RANKING_SCORE_MIN = 0;
export const RANKING_SCORE_MAX = 10;

export const DEFAULT_RANKING_PRESETS: Record<string, RankingWeights> = {
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
