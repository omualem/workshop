import { Injectable } from "@nestjs/common";
import { computeStabilityAdjustedScore } from "@rental/scoring";
import type { BundleSearchInput, RankingWeights } from "@rental/types";
import type { GeneratedBundle } from "./bundle-search.types";

@Injectable()
export class BundleScoringService {
  scoreBundle(bundle: GeneratedBundle, allBundles: GeneratedBundle[], input: BundleSearchInput, weights: RankingWeights) {
    const concreteItems = bundle.items.filter((item) => item.listing);
    const totalPrices = allBundles.map((candidate) => candidate.totalPrice).filter((value) => value > 0);
    const medianPrice = this.median(totalPrices);
    const priceRatio = medianPrice > 0 ? medianPrice / Math.max(bundle.totalPrice, 1) : 1;
    const budgetBonus = input.maxBudget
      ? bundle.totalPrice <= input.maxBudget
        ? 0.8
        : -Math.min(2.5, (bundle.totalPrice - input.maxBudget) / input.maxBudget * 5)
      : 0;
    const priceScore = this.clamp(5 + (priceRatio - 1) * 5 + budgetBonus);

    const reliabilityScore = this.clamp(
      concreteItems.reduce((sum, item) => sum + item.reliabilityScore, 0) / Math.max(1, concreteItems.length),
    );

    const logisticsPenalty =
      bundle.totalDistanceKm * 0.12 + (bundle.pickupPointsCount - 1) * 1.6 + (bundle.lendersCount - 1) * 0.8;
    const sameLenderBonus = bundle.lendersCount === 1 ? 1.4 : bundle.lendersCount === 2 ? 0.5 : 0;
    const deliveryBonus = input.deliveryPreferred && concreteItems.every((item) => item.listing?.deliverySupported)
      ? 0.8
      : 0;
    const logisticsScore = this.clamp(10 - logisticsPenalty + sameLenderBonus + deliveryBonus);

    const availabilityScore = this.clamp(
      concreteItems.reduce((sum, item) => sum + item.availabilityFitScore, 0) /
        Math.max(1, concreteItems.length) +
        (bundle.exactAvailabilityFit ? 0.4 : -0.8),
    );

    const productQualityScore = this.clamp(
      concreteItems.reduce((sum, item) => sum + item.qualityScore, 0) / Math.max(1, concreteItems.length),
    );

    const stability = computeStabilityAdjustedScore(
      {
        price: priceScore,
        reliability: reliabilityScore,
        logistics: logisticsScore,
        availability: availabilityScore,
        quality: productQualityScore,
      },
      weights,
    );

    const stabilityScore = this.clamp(
      10 - stability.imbalancePenalty - stability.lowScorePenalty + stability.bottleneckAdjustment / 2,
    );

    return {
      finalScore: stability.finalScore,
      priceScore,
      reliabilityScore,
      logisticsScore,
      availabilityScore,
      productQualityScore,
      stabilityScore,
      stability,
    };
  }

  private median(values: number[]) {
    if (values.length === 0) {
      return 0;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(10, value));
  }
}
