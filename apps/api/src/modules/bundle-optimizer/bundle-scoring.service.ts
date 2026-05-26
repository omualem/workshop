import { Injectable } from "@nestjs/common";
import { haversineDistanceKm } from "@rental/utils";
import { MetricNormalizationService } from "./metric-normalization.service";
import type {
  BundleMetrics,
  CandidateItem,
  DerivedQuantities,
  OptimizerPreferences,
  ResolvedOptimizerPreferences,
  ScoreBreakdown,
  ScoredBundle,
  SelectedBundle,
} from "./bundle-optimizer.types";

/**
 * Per-metric thresholds and weights for the LowScorePenalty term.
 *
 *   LowScorePenalty(x) = sum_j eta_j * max(0, theta_j - M_j(x))
 */
const LOW_SCORE_THRESHOLDS = {
  price: 4.0,
  distance: 4.0,
  reliability: 6.5,
  availability: 7.0,
} as const;

const LOW_SCORE_WEIGHTS = {
  price: 0.25,
  distance: 0.35,
  reliability: 0.65,
  availability: 0.8,
} as const;

/**
 * Bundle scoring - the final objective function.
 *
 *   Score(x) = clamp(
 *       sum_j w_j * M_j(x)
 *     - lambda * Var(M(x))
 *     + alpha * min_j M_j(x)
 *     - beta * P_u(x)
 *     - gamma * D_max(x)
 *     - sum_j eta_j * max(0, theta_j - M_j(x))
 *   , 0, 10)
 *
 * Where M(x) = (price, distance, reliability, availability).
 */
@Injectable()
export class BundleScoringService {
  constructor(private readonly normalization: MetricNormalizationService) {}

  calculateBundleMetrics(
    bundle: SelectedBundle,
    budget: number,
    alphaDistanceMix: number,
  ): { metrics: BundleMetrics; derived: DerivedQuantities } {
    const items = bundle.items;

    const distances = items.map((i) => i.distanceKm);
    const avgDistance = this.normalization.mean(distances);
    const maxDistance = distances.length ? Math.max(...distances) : 0;
    const m_distance = this.normalization.bundleDistanceScore(
      avgDistance,
      maxDistance,
      alphaDistanceMix,
    );
    const m_availability = Math.min(...items.map((i) => i.m_availability));
    const m_reliability = this.normalization.mean(
      items.map((i) => i.m_reliability),
    );

    const metrics: BundleMetrics = {
      price: this.normalization.bundlePriceScore(bundle.totalPrice, budget),
      distance: m_distance,
      reliability: m_reliability,
      availability: m_availability,
    };

    const pickupCost = this.calculatePickupCost(items);
    const derived: DerivedQuantities = {
      avgDistance,
      maxDistance,
      pickupCost,
      pickupStops: bundle.uniquePickupCount,
      deviationDaysSum: items.reduce((s, i) => s + i.deviationDays, 0),
    };

    return { metrics, derived };
  }

  calculateWeightedUtility(
    metrics: BundleMetrics,
    weights: OptimizerPreferences["weights"],
  ) {
    return (
      weights.price * metrics.price +
      weights.distance * metrics.distance +
      weights.reliability * metrics.reliability +
      weights.availability * metrics.availability
    );
  }

  variance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    return values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  }

  calculateVariancePenalty(metrics: BundleMetrics, lambda: number): number {
    return lambda * this.variance(this.metricVector(metrics));
  }

  calculateBottleneckTerm(metrics: BundleMetrics, alpha: number): number {
    return alpha * Math.min(...this.metricVector(metrics));
  }

  calculatePickupCost(items: CandidateItem[]): number {
    const uniquePickups = new Map<string, { lat: number; lng: number }>();
    for (const item of items) {
      if (!uniquePickups.has(item.pickupKey)) {
        uniquePickups.set(item.pickupKey, {
          lat: item.pickupLat,
          lng: item.pickupLng,
        });
      }
    }
    const points = [...uniquePickups.values()];
    let total = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        total += haversineDistanceKm(points[i], points[j]);
      }
    }
    return total;
  }

  calculatePickupComplexityPenalty(
    bundle: SelectedBundle,
    pickupCostKm: number,
    beta: number,
  ): number {
    const spatial = this.normalization.normalizePickupCost(pickupCostKm);
    const countOverhead = Math.max(0, bundle.uniquePickupCount - 1);
    return beta * (spatial + countOverhead);
  }

  calculateMaxDistancePenalty(maxDistanceKm: number, gamma: number): number {
    return this.normalization.maxDistancePenalty(maxDistanceKm, gamma);
  }

  calculateLowScorePenalty(
    metrics: BundleMetrics,
    multipliers: ScoreBreakdown["preferences"]["penaltyMultipliers"]["lowScore"] = {
      price: 1,
      distance: 1,
      reliability: 1,
      availability: 1,
    },
  ): {
    total: number;
    breakdown: ScoreBreakdown["lowScorePenaltyBreakdown"];
  } {
    const breakdown = {
      price:
        LOW_SCORE_WEIGHTS.price *
        multipliers.price *
        Math.max(0, LOW_SCORE_THRESHOLDS.price - metrics.price),
      distance:
        LOW_SCORE_WEIGHTS.distance *
        multipliers.distance *
        Math.max(0, LOW_SCORE_THRESHOLDS.distance - metrics.distance),
      reliability:
        LOW_SCORE_WEIGHTS.reliability *
        multipliers.reliability *
        Math.max(0, LOW_SCORE_THRESHOLDS.reliability - metrics.reliability),
      availability:
        LOW_SCORE_WEIGHTS.availability *
        multipliers.availability *
        Math.max(0, LOW_SCORE_THRESHOLDS.availability - metrics.availability),
    };
    const total =
      breakdown.price +
      breakdown.distance +
      breakdown.reliability +
      breakdown.availability;
    return { total, breakdown };
  }

  calculateFinalScore(
    bundle: SelectedBundle,
    prefs: OptimizerPreferences,
    budget: number,
    resolvedPreferences: ResolvedOptimizerPreferences = fallbackResolvedPreferences(prefs),
  ): ScoredBundle {
    const { metrics, derived } = this.calculateBundleMetrics(
      bundle,
      budget,
      prefs.alphaDistanceMix,
    );

    const weightedUtility = this.calculateWeightedUtility(metrics, prefs.weights);
    const variancePenalty = this.calculateVariancePenalty(
      metrics,
      prefs.lambdaVariance * resolvedPreferences.penaltyWeights.variance,
    );
    const bottleneckTerm = this.calculateBottleneckTerm(
      metrics,
      prefs.alphaBottleneck * resolvedPreferences.penaltyWeights.bottleneck,
    );
    const pickupPenalty = this.calculatePickupComplexityPenalty(
      bundle,
      derived.pickupCost,
      prefs.betaPickup * resolvedPreferences.penaltyWeights.pickup,
    );
    const maxDistancePenalty = this.calculateMaxDistancePenalty(
      derived.maxDistance,
      prefs.gammaMaxDistance * resolvedPreferences.penaltyWeights.maxDistance,
    );
    const { total: lowScorePenalty, breakdown: lowScorePenaltyBreakdown } =
      this.calculateLowScorePenalty(
        metrics,
        resolvedPreferences.penaltyWeights.lowScore,
      );

    const rawFinalScore =
      weightedUtility -
      variancePenalty +
      bottleneckTerm -
      pickupPenalty -
      maxDistancePenalty -
      lowScorePenalty;
    const finalScore = this.normalization.clamp(rawFinalScore, 0, 10);

    const breakdown: ScoreBreakdown = {
      weightedUtility,
      variancePenalty,
      bottleneckTerm,
      pickupPenalty,
      maxDistancePenalty,
      lowScorePenalty,
      lowScorePenaltyBreakdown,
      preferences: {
        profile: resolvedPreferences.profile,
        baseProfile: resolvedPreferences.baseProfile,
        sliders: resolvedPreferences.sliders,
        normalizedWeights: resolvedPreferences.weights,
        penaltyMultipliers: resolvedPreferences.penaltyWeights,
      },
      rawFinalScore,
      finalScore,
    };

    return { bundle, metrics, derived, breakdown };
  }

  partialScore(
    items: CandidateItem[],
    prefs: OptimizerPreferences,
    budget: number,
  ): number {
    if (items.length === 0) return 0;
    const totalPrice = items.reduce((s, i) => s + i.price, 0);
    const distances = items.map((i) => i.distanceKm);
    const avgDistance = this.normalization.mean(distances);
    const maxDistance = Math.max(...distances);
    const partialMetrics: BundleMetrics = {
      price: this.normalization.bundlePriceScore(totalPrice, budget),
      distance: this.normalization.bundleDistanceScore(
        avgDistance,
        maxDistance,
        prefs.alphaDistanceMix,
      ),
      reliability: this.normalization.mean(items.map((i) => i.m_reliability)),
      availability: Math.min(...items.map((i) => i.m_availability)),
    };
    return (
      this.calculateWeightedUtility(partialMetrics, prefs.weights) -
      this.calculateVariancePenalty(partialMetrics, prefs.lambdaVariance)
    );
  }

  private metricVector(m: BundleMetrics): number[] {
    return [m.price, m.distance, m.reliability, m.availability];
  }
}

function fallbackResolvedPreferences(
  prefs: OptimizerPreferences,
): ResolvedOptimizerPreferences {
  return {
    profile: "balanced",
    sliders: {
      price: 7,
      distance: 7,
      reliability: 7,
      availability: 7,
      pickupSimplicity: 7,
    },
    weights: prefs.weights,
    penaltyWeights: {
      pickup: 1,
      lowScore: {
        price: 1,
        distance: 1,
        reliability: 1,
        availability: 1,
      },
      maxDistance: 1,
      variance: 1,
      bottleneck: 1,
    },
    lambdaVariance: prefs.lambdaVariance,
    alphaBottleneck: prefs.alphaBottleneck,
    betaPickup: prefs.betaPickup,
    gammaMaxDistance: prefs.gammaMaxDistance,
    alphaDistanceMix: prefs.alphaDistanceMix,
    topKPerSlot: prefs.topKPerSlot,
    beamWidth: prefs.beamWidth,
  };
}
