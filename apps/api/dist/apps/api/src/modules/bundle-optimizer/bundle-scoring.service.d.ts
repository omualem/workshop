import { MetricNormalizationService } from "./metric-normalization.service";
import type { BundleMetrics, CandidateItem, DerivedQuantities, OptimizerPreferences, ScoredBundle, SelectedBundle } from "./bundle-optimizer.types";
export declare class BundleScoringService {
    private readonly normalization;
    constructor(normalization: MetricNormalizationService);
    calculateBundleMetrics(bundle: SelectedBundle, budget: number, alphaDistanceMix: number): {
        metrics: BundleMetrics;
        derived: DerivedQuantities;
    };
    calculateWeightedUtility(metrics: BundleMetrics, weights: OptimizerPreferences["weights"]): number;
    variance(values: number[]): number;
    calculateVariancePenalty(metrics: BundleMetrics, lambda: number): number;
    calculateBottleneckTerm(metrics: BundleMetrics, alpha: number): number;
    calculatePickupCost(items: CandidateItem[]): number;
    calculatePickupComplexityPenalty(bundle: SelectedBundle, pickupCostKm: number, beta: number): number;
    calculateMaxDistancePenalty(maxDistanceKm: number, gamma: number): number;
    calculateFinalScore(bundle: SelectedBundle, prefs: OptimizerPreferences, budget: number): ScoredBundle;
    partialScore(items: CandidateItem[], prefs: OptimizerPreferences, budget: number): number;
    private metricVector;
}
