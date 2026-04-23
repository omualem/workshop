import {
  RANKING_BOTTLENECK_GAMMA,
  RANKING_LOW_SCORE_BETA,
  RANKING_LOW_SCORE_THRESHOLD,
  RANKING_SCORE_MAX,
  RANKING_SCORE_MIN,
  RANKING_STD_DEV_ALPHA,
} from "@rental/config";
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

export const clampScore = (value: number) =>
  Math.max(RANKING_SCORE_MIN, Math.min(RANKING_SCORE_MAX, value));

export const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

export const stdDev = (values: number[]) => {
  const avg = mean(values);
  const variance = mean(values.map((value) => (value - avg) ** 2));
  return Math.sqrt(variance);
};

export const computeStabilityAdjustedScore = (
  scores: CoreDimensionScores,
  weights: RankingWeights,
): StabilityComputation => {
  const values = Object.values(scores);
  const weightedMean =
    scores.price * weights.price +
    scores.reliability * weights.reliability +
    scores.logistics * weights.logistics +
    scores.availability * weights.availability +
    scores.quality * weights.quality;

  const variation = stdDev(values);
  const imbalancePenalty = variation * RANKING_STD_DEV_ALPHA;

  const weakEntries = Object.entries(scores).filter(
    ([, score]) => score < RANKING_LOW_SCORE_THRESHOLD,
  );

  const lowScorePenalty =
    weakEntries.reduce((sum, [, score]) => sum + (RANKING_LOW_SCORE_THRESHOLD - score), 0) *
    RANKING_LOW_SCORE_BETA;

  const bottleneckAdjustment = Math.min(...values) * RANKING_BOTTLENECK_GAMMA;
  const finalScore = clampScore(
    weightedMean - imbalancePenalty - lowScorePenalty + bottleneckAdjustment,
  );

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
