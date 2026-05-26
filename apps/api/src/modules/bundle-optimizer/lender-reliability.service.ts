import { Injectable } from "@nestjs/common";

/**
 * Recalibrated 2026-05-02:
 *   - Bayesian prior lowered from 4.2/5 → 3.7/5 so brand-new lenders no
 *     longer start near "high reliability".
 *   - Sample-confidence horizon raised from 25 → 30 transactions.
 *   - Explicit new-lender penalty: −1.0 below 5 transactions, −1.5 below 2.
 *   - Verification bonuses reduced (TRUSTED 0.8, VERIFIED 0.4) so they
 *     cannot single-handedly push an unproven lender above 8.
 */
@Injectable()
export class LenderReliabilityService {
  compute(input: {
    averageRating: number;
    completedTransactionsCount: number;
    cancellationRate: number;
    lateReturnRate: number;
    complaintRate: number;
    verificationLevel: "BASIC" | "VERIFIED" | "TRUSTED";
    responseTimeScore: number;
  }) {
    const sampleWeight = Math.min(1, input.completedTransactionsCount / 30);
    const bayesianRating = input.averageRating * sampleWeight + 3.7 * (1 - sampleWeight);
    const ratingNormalized = (bayesianRating / 5) * 10;
    const completionRateNormalized = Math.max(
      0,
      10 - (input.cancellationRate + input.lateReturnRate + input.complaintRate) * 0.18,
    );
    const verificationBonus =
      input.verificationLevel === "TRUSTED"
        ? 0.8
        : input.verificationLevel === "VERIFIED"
          ? 0.4
          : 0;
    const responseBonus = Math.max(0, Math.min(1.2, input.responseTimeScore / 10));

    let reliability =
      ratingNormalized * 0.42 +
      completionRateNormalized * 0.38 +
      verificationBonus +
      responseBonus;

    // New-lender uncertainty penalty. Cumulative buckets, not stacked:
    // a lender with 0–1 transactions gets −1.5; 2–4 gets −1.0; 5+ none.
    if (input.completedTransactionsCount < 2) {
      reliability -= 1.5;
    } else if (input.completedTransactionsCount < 5) {
      reliability -= 1.0;
    }

    return Math.max(0, Math.min(10, reliability));
  }
}
