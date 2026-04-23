import type { RankingWeights } from "@rental/types";
export type CoreDimensionScores = {
    price: number;
    reliability: number;
    logistics: number;
    availability: number;
    quality: number;
};
export type StabilityComputation = {
    weightedMean: number;
    stdDev: number;
    imbalancePenalty: number;
    lowScorePenalty: number;
    bottleneckAdjustment: number;
    finalScore: number;
    weakDimensions: string[];
};
export declare const clampScore: (value: number) => number;
export declare const mean: (values: number[]) => number;
export declare const stdDev: (values: number[]) => number;
export declare const computeStabilityAdjustedScore: (scores: CoreDimensionScores, weights: RankingWeights) => StabilityComputation;
