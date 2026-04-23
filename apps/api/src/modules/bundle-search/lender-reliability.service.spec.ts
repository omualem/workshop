import { LenderReliabilityService } from "./lender-reliability.service";

describe("LenderReliabilityService", () => {
  const service = new LenderReliabilityService();

  it("rewards trusted lenders with low cancellation and strong ratings", () => {
    const score = service.compute({
      averageRating: 4.9,
      completedTransactionsCount: 120,
      cancellationRate: 2,
      lateReturnRate: 1,
      complaintRate: 0.5,
      verificationLevel: "TRUSTED",
      responseTimeScore: 9.3,
    });

    expect(score).toBeGreaterThan(8);
  });

  it("smooths small samples and penalizes poor operational metrics", () => {
    const score = service.compute({
      averageRating: 5,
      completedTransactionsCount: 2,
      cancellationRate: 18,
      lateReturnRate: 14,
      complaintRate: 8,
      verificationLevel: "BASIC",
      responseTimeScore: 4,
    });

    expect(score).toBeLessThan(6);
  });
});
