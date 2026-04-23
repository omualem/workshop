import { DEFAULT_RANKING_PRESETS } from "@rental/config";
import type { PreferenceProfile, RankingWeights } from "@rental/types";

export const normalizeWeights = (weights: RankingWeights): RankingWeights => {
  const total =
    weights.price +
    weights.reliability +
    weights.logistics +
    weights.availability +
    weights.quality;

  if (total <= 0) {
    return DEFAULT_RANKING_PRESETS.balanced;
  }

  return {
    price: weights.price / total,
    reliability: weights.reliability / total,
    logistics: weights.logistics / total,
    availability: weights.availability / total,
    quality: weights.quality / total,
  };
};

export const resolvePresetWeights = (
  preferenceProfile: PreferenceProfile,
  weights?: RankingWeights,
): RankingWeights => {
  if (preferenceProfile === "custom" && weights) {
    return normalizeWeights(weights);
  }

  return normalizeWeights(
    DEFAULT_RANKING_PRESETS[preferenceProfile] ?? DEFAULT_RANKING_PRESETS.balanced,
  );
};
