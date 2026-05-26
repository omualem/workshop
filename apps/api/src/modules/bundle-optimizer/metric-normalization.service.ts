import { Injectable } from "@nestjs/common";

/**
 * Metric normalization — every M_j(x) ∈ [0, 10].
 *
 * The optimizer evaluates candidates on four dimensions:
 *   M_price, M_distance, M_reliability, M_availability
 *
 * Per-candidate normalization is relative to the slot's candidate pool
 * (so the cheapest/closest candidate scores 10), while raw reliability and
 * availability already arrive on a 0..10 scale.
 */
@Injectable()
export class MetricNormalizationService {
  /** Clamp x into [lo, hi]. */
  clamp(value: number, lo = 0, hi = 10): number {
    if (Number.isNaN(value)) return lo;
    return Math.max(lo, Math.min(hi, value));
  }

  /**
   * Distance → [0,10], lower is better.
   *
   * Smooth exponential decay: a candidate at 0 km scores 10, at 25 km
   * roughly 6, at 50 km roughly 3.5. Independent of the candidate pool
   * so the user sees stable distance scores across slots.
   *
   *   normalizeDistanceScore(d_i) = 10 · exp(-d_i / 30)
   */
  normalizeDistanceScore(distanceKm: number): number {
    return this.clamp(10 * Math.exp(-Math.max(0, distanceKm) / 30));
  }

  /**
   * Reliability already arrives in [0,10] from LenderReliabilityService;
   * we just clamp it defensively.
   */
  normalizeReliabilityScore(reliability: number): number {
    return this.clamp(reliability);
  }

  /**
   * Availability — exact date fit ⇒ 10. Inputs are computed by the
   * candidate-filter from inventory and existing booking blocks
   * (10 = fully available, 0 = unavailable).
   */
  normalizeAvailabilityScore(availability: number): number {
    return this.clamp(availability);
  }

  /**
   * Bundle-level price M_price(x) — penalizes how much of the budget B
   * the bundle consumes. Bundles that exceed B are filtered earlier
   * by the budget constraint, so totalPrice ≤ B here.
   *
   *   M_price(x) = 10 · (1 − totalPrice / B)        (clamped to [0,10])
   */
  bundlePriceScore(totalPrice: number, budget: number): number {
    if (budget <= 0) return 0;
    return this.clamp(10 * (1 - totalPrice / budget));
  }

  /** Arithmetic mean of an array; 0 for an empty input. */
  mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Per-item availability with slack/deviation penalty.
   *
   *   • exact match (deviation = 0)        ⇒ 10
   *   • small deviation (≤ 1 day)          ⇒ ~7–9
   *   • larger deviation                    ⇒ decays linearly
   *   • not available at all                ⇒ filtered earlier (hard)
   *
   *   availabilityScore_i = clamp(10 − 2·deviation_i,  0,  10)
   *
   * Mathematical model:
   *   A(x) = min_i (availability_i − deviation_i)         (bundle level)
   */
  availabilityFromDeviation(deviationDays: number): number {
    return this.clamp(10 - 2 * Math.max(0, deviationDays));
  }

  /**
   * Distance score for a bundle, mixing average and worst-case distance.
   *
   *   D(x)         = α_dist · mean(d_i) + (1 − α_dist) · max(d_i)
   *   M_distance(x) = 10 · exp(−D(x) / 30)
   *
   * α_dist ∈ [0,1] interpolates between purely-average (α=1) and
   * purely-worst-case (α=0). Higher α tolerates one far pickup; lower α
   * is risk-averse and demands every pickup be close.
   */
  bundleDistanceScore(avgDistanceKm: number, maxDistanceKm: number, alphaMix: number): number {
    const D = alphaMix * avgDistanceKm + (1 - alphaMix) * maxDistanceKm;
    return this.clamp(10 * Math.exp(-Math.max(0, D) / 30));
  }

  /**
   * Penalty contribution of the worst pickup distance.
   *
   *   maxDistancePenalty(x) = γ · (1 − exp(−max(d_i) / 30))
   *
   * Always in [0, γ]; pushes the optimizer to avoid one outlier
   * pickup that the average distance would otherwise hide.
   */
  maxDistancePenalty(maxDistanceKm: number, gamma: number): number {
    return gamma * (1 - Math.exp(-Math.max(0, maxDistanceKm) / 30));
  }

  /**
   * Normalize the spatial pickup cost (sum of pairwise distances between
   * unique pickup points, in km) into a non-negative penalty multiplier
   * roughly in [0, ~3]. Used as the magnitude factor of β · P_u(x).
   *
   *   normalizedPickupCost = pickupCostKm / 25
   */
  normalizePickupCost(pickupCostKm: number): number {
    return Math.max(0, pickupCostKm) / 25;
  }
}
