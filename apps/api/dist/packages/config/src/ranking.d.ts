import type { RankingWeights } from "@rental/types";
export declare const RANKING_LOW_SCORE_THRESHOLD = 5.2;
export declare const RANKING_STD_DEV_ALPHA = 0.35;
export declare const RANKING_LOW_SCORE_BETA = 0.6;
export declare const RANKING_BOTTLENECK_GAMMA = 0.28;
export declare const RANKING_SCORE_MIN = 0;
export declare const RANKING_SCORE_MAX = 10;
export declare const DEFAULT_RANKING_PRESETS: Record<string, RankingWeights>;
