import { Injectable } from "@nestjs/common";
import { haversineDistanceKm } from "@rental/utils";
import { MetricNormalizationService } from "./metric-normalization.service";
import type {
  BundleMetrics,
  CandidateItem,
  DerivedQuantities,
  OptimizerPreferences,
  ScoreBreakdown,
  ScoredBundle,
  SelectedBundle,
} from "./bundle-optimizer.types";

/**
 * Per-metric thresholds and weights for the LowScorePenalty term.
 *
 *   LowScorePenalty(x) = Σ_j ω_j · max(0, τ_j − M_j(x))
 *
 * Threshold τ_j is the floor below which the metric is considered weak
 * enough to warrant an extra subtractive penalty (on top of the bottleneck
 * bonus shrinking). Weight ω_j is how aggressively each dimension is
 * punished. Reliability/condition/availability are weighted higher than
 * price/distance because failing on those dimensions reflects something
 * the user usually does not want to trade away.
 */
const LOW_SCORE_THRESHOLDS = {
  price: 4.0,
  distance: 4.0,
  reliability: 6.5,
  condition: 6.5,
  availability: 7.0,
} as const;

const LOW_SCORE_WEIGHTS = {
  price: 0.25,
  distance: 0.35,
  reliability: 0.65,
  condition: 0.7,
  availability: 0.8,
} as const;

/**
 * Bundle scoring — the FINAL OBJECTIVE FUNCTION.
 *
 *   Score(x) = clamp(
 *       Σ_j  w_j · M_j(x)            (weighted utility)
 *     − λ · Var(M(x))                 (variance penalty)
 *     + α · min_j M_j(x)              (bottleneck term)
 *     − β · P_u(x)                    (pickup-complexity penalty)
 *     − γ · D_max(x)                  (worst-pickup distance term)
 *     − Σ_j ω_j · max(0, τ_j − M_j(x))  (low-score penalty)
 *   ,  0, 10)
 *
 * Where
 *   M_j(x) ∈ [0,10]   bundle-level metrics
 *   M_distance(x)     = 10·exp(− [α_dist·mean(d_i) + (1−α_dist)·max(d_i)] / 30 )
 *   M_condition(x)    = 0.6·mean(c_i) + 0.4·min(c_i)
 *                       (bottleneck-aware, so one weak item drags the bundle)
 *   M_availability(x) = min_i (10 − 2·deviationDays_i)
 *   P_u(x)            = normalize( Σ_{i<j} dist(L(i),L(j)) )  + (|stops|−1)
 *   D_max(x)          = 1 − exp(− max(d_i) / 30 )
 */
@Injectable()
export class BundleScoringService {
  constructor(private readonly normalization: MetricNormalizationService) {}

  /**
   * Lifts per-candidate signals into the bundle-level vector
   * M(x) = (M_price, M_distance, M_reliability, M_condition, M_availability)
   * AND returns the derived quantities used by penalties / debug output.
   */
  calculateBundleMetrics(
    bundle: SelectedBundle,
    budget: number,
    alphaDistanceMix: number,
  ): { metrics: BundleMetrics; derived: DerivedQuantities } {
    const items = bundle.items;

    // Distance: avg + max → mixed → exponential normalization (see types)
    const distances = items.map((i) => i.distanceKm);
    const avgDistance = this.normalization.mean(distances);
    const maxDistance = distances.length ? Math.max(...distances) : 0;
    const m_distance = this.normalization.bundleDistanceScore(avgDistance, maxDistance, alphaDistanceMix);

    // Availability: min over per-item availability (already deviation-aware)
    const m_availability = Math.min(...items.map((i) => i.m_availability));

    // Reliability: simple average (per-item already in [0,10]).
    const m_reliability = this.normalization.mean(items.map((i) => i.m_reliability));

    // Condition is bottleneck-aware: 0.6·avg + 0.4·min so a single weak
    // item meaningfully drags the bundle's condition metric instead of
    // being averaged away by stronger items.
    const conditionScores = items.map((i) => i.m_condition);
    const conditionAvg = this.normalization.mean(conditionScores);
    const conditionMin = conditionScores.length ? Math.min(...conditionScores) : 0;
    const m_condition = 0.6 * conditionAvg + 0.4 * conditionMin;

    const metrics: BundleMetrics = {
      price: this.normalization.bundlePriceScore(bundle.totalPrice, budget),
      distance: m_distance,
      reliability: m_reliability,
      condition: m_condition,
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

  /** Σ_j w_j · M_j(x) */
  calculateWeightedUtility(metrics: BundleMetrics, weights: OptimizerPreferences["weights"]) {
    return (
      weights.price * metrics.price +
      weights.distance * metrics.distance +
      weights.reliability * metrics.reliability +
      weights.condition * metrics.condition +
      weights.availability * metrics.availability
    );
  }

  /** Population variance over the 5 metric values. */
  variance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    return values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  }

  /** λ · Var(M(x)) */
  calculateVariancePenalty(metrics: BundleMetrics, lambda: number): number {
    return lambda * this.variance(this.metricVector(metrics));
  }

  /** α · min_j M_j(x) */
  calculateBottleneckTerm(metrics: BundleMetrics, alpha: number): number {
    return alpha * Math.min(...this.metricVector(metrics));
  }

  /**
   * Spatial pickup cost.
   *
   *   pickupCost(x) = Σ_{i<j ∈ unique pickups} haversine( L(i), L(j) )   [km]
   *
   * Approximates how much the renter has to drive between pickups. Two
   * lenders close together (same neighborhood) ⇒ cheap. Two lenders on
   * opposite sides of the city ⇒ expensive.
   */
  calculatePickupCost(items: CandidateItem[]): number {
    const uniquePickups = new Map<string, { lat: number; lng: number }>();
    for (const item of items) {
      if (!uniquePickups.has(item.pickupKey)) {
        uniquePickups.set(item.pickupKey, { lat: item.pickupLat, lng: item.pickupLng });
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

  /**
   * β · P_u(x)
   *
   * Combines the SPATIAL pickup cost (how far apart pickups are) with
   * the COUNT of extra stops (run-around overhead beyond the first stop):
   *
   *   P_u(x) = normalizePickupCost( Σ pairwise km )  +  (stops − 1)
   *   penalty = β · P_u(x)
   */
  calculatePickupComplexityPenalty(
    bundle: SelectedBundle,
    pickupCostKm: number,
    beta: number,
  ): number {
    const spatial = this.normalization.normalizePickupCost(pickupCostKm);
    const countOverhead = Math.max(0, bundle.uniquePickupCount - 1);
    return beta * (spatial + countOverhead);
  }

  /** γ · D_max(x) — penalty for the WORST pickup distance in the bundle. */
  calculateMaxDistancePenalty(maxDistanceKm: number, gamma: number): number {
    return this.normalization.maxDistancePenalty(maxDistanceKm, gamma);
  }

  /**
   * LowScorePenalty(x) = Σ_j ω_j · max(0, τ_j − M_j(x))
   *
   * Returns both the total penalty and the per-metric contribution so the
   * explanation/debug layers can show users exactly which dimension cost
   * the bundle the most points.
   */
  calculateLowScorePenalty(metrics: BundleMetrics): {
    total: number;
    breakdown: ScoreBreakdown["lowScorePenaltyBreakdown"];
  } {
    const breakdown = {
      price: LOW_SCORE_WEIGHTS.price * Math.max(0, LOW_SCORE_THRESHOLDS.price - metrics.price),
      distance: LOW_SCORE_WEIGHTS.distance * Math.max(0, LOW_SCORE_THRESHOLDS.distance - metrics.distance),
      reliability: LOW_SCORE_WEIGHTS.reliability * Math.max(0, LOW_SCORE_THRESHOLDS.reliability - metrics.reliability),
      condition: LOW_SCORE_WEIGHTS.condition * Math.max(0, LOW_SCORE_THRESHOLDS.condition - metrics.condition),
      availability: LOW_SCORE_WEIGHTS.availability * Math.max(0, LOW_SCORE_THRESHOLDS.availability - metrics.availability),
    };
    const total =
      breakdown.price +
      breakdown.distance +
      breakdown.reliability +
      breakdown.condition +
      breakdown.availability;
    return { total, breakdown };
  }

  /** Final objective function — calls all components and combines them. */
  calculateFinalScore(bundle: SelectedBundle, prefs: OptimizerPreferences, budget: number): ScoredBundle {
    const { metrics, derived } = this.calculateBundleMetrics(bundle, budget, prefs.alphaDistanceMix);

    const weightedUtility = this.calculateWeightedUtility(metrics, prefs.weights);
    const variancePenalty = this.calculateVariancePenalty(metrics, prefs.lambdaVariance);
    const bottleneckTerm = this.calculateBottleneckTerm(metrics, prefs.alphaBottleneck);
    const pickupPenalty = this.calculatePickupComplexityPenalty(bundle, derived.pickupCost, prefs.betaPickup);
    const maxDistancePenalty = this.calculateMaxDistancePenalty(derived.maxDistance, prefs.gammaMaxDistance);
    const { total: lowScorePenalty, breakdown: lowScorePenaltyBreakdown } =
      this.calculateLowScorePenalty(metrics);

    // Score(x) = weightedUtility − λVar + α·min − β·P_u − γ·D_max − LowScorePenalty
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
      rawFinalScore,
      finalScore,
    };

    return { bundle, metrics, derived, breakdown };
  }

  /**
   * Lightweight partial-bundle score used by beam search to rank
   * incomplete bundles. Uses weighted utility minus variance only;
   * non-monotone terms (bottleneck, spatial pickup, γ·D_max) are
   * computed at the end.
   */
  partialScore(items: CandidateItem[], prefs: OptimizerPreferences, budget: number): number {
    if (items.length === 0) return 0;
    const totalPrice = items.reduce((s, i) => s + i.price, 0);
    const distances = items.map((i) => i.distanceKm);
    const avgDistance = this.normalization.mean(distances);
    const maxDistance = Math.max(...distances);
    const partialMetrics: BundleMetrics = {
      price: this.normalization.bundlePriceScore(totalPrice, budget),
      distance: this.normalization.bundleDistanceScore(avgDistance, maxDistance, prefs.alphaDistanceMix),
      reliability: this.normalization.mean(items.map((i) => i.m_reliability)),
      condition: this.normalization.mean(items.map((i) => i.m_condition)),
      availability: Math.min(...items.map((i) => i.m_availability)),
    };
    return (
      this.calculateWeightedUtility(partialMetrics, prefs.weights) -
      this.calculateVariancePenalty(partialMetrics, prefs.lambdaVariance)
    );
  }

  private metricVector(m: BundleMetrics): number[] {
    return [m.price, m.distance, m.reliability, m.condition, m.availability];
  }
}
