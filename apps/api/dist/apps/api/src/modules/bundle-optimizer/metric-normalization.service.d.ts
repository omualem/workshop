export declare class MetricNormalizationService {
    clamp(value: number, lo?: number, hi?: number): number;
    normalizeDistanceScore(distanceKm: number): number;
    normalizeReliabilityScore(reliability: number): number;
    normalizeAvailabilityScore(availability: number): number;
    bundlePriceScore(totalPrice: number, budget: number): number;
    mean(values: number[]): number;
    availabilityFromDeviation(deviationDays: number): number;
    bundleDistanceScore(avgDistanceKm: number, maxDistanceKm: number, alphaMix: number): number;
    maxDistancePenalty(maxDistanceKm: number, gamma: number): number;
    normalizePickupCost(pickupCostKm: number): number;
}
