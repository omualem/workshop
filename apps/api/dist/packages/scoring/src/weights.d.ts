import type { PreferenceProfile, RankingWeights } from "@rental/types";
export declare const normalizeWeights: (weights: RankingWeights) => RankingWeights;
export declare const resolvePresetWeights: (preferenceProfile: PreferenceProfile, weights?: RankingWeights) => RankingWeights;
