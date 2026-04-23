import { Injectable } from "@nestjs/common";

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
    const sampleWeight = Math.min(1, input.completedTransactionsCount / 25);
    const bayesianRating = input.averageRating * sampleWeight + 4.2 * (1 - sampleWeight);
    const ratingNormalized = (bayesianRating / 5) * 10;
    const completionRateNormalized = Math.max(
      0,
      10 - (input.cancellationRate + input.lateReturnRate + input.complaintRate) * 0.18,
    );
    const verificationBonus =
      input.verificationLevel === "TRUSTED"
        ? 1.2
        : input.verificationLevel === "VERIFIED"
          ? 0.6
          : 0;
    const responseBonus = Math.max(0, Math.min(1.2, input.responseTimeScore / 10));

    return Math.max(
      0,
      Math.min(
        10,
        ratingNormalized * 0.42 +
          completionRateNormalized * 0.38 +
          verificationBonus +
          responseBonus,
      ),
    );
  }
}
