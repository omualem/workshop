export const DEFAULT_FEATURE_FLAGS = {
  enableExperimentalRankingV2: false,
  enableDeliveryBoost: true,
  enableFlexibleDateMatching: true,
  enableAdminBundleDebug: true,
};

export type FeatureFlags = typeof DEFAULT_FEATURE_FLAGS;
