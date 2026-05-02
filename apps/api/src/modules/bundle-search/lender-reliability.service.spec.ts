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

  it("scores a brand-new lender below 7.5 even with TRUSTED verification", () => {
    // Recalibration goal: a lender with 0 transactions should not start
    // near "high reliability" (≥ 8) just because of verification + prior.
    const score = service.compute({
      averageRating: 0,
      completedTransactionsCount: 0,
      cancellationRate: 0,
      lateReturnRate: 0,
      complaintRate: 0,
      verificationLevel: "TRUSTED",
      responseTimeScore: 7,
    });

    expect(score).toBeLessThan(7.5);
  });

  it("applies a stronger uncertainty penalty below 2 transactions than below 5", () => {
    const common = {
      averageRating: 4.5,
      cancellationRate: 0,
      lateReturnRate: 0,
      complaintRate: 0,
      verificationLevel: "BASIC" as const,
      responseTimeScore: 7,
    };
    const veryNew = service.compute({ ...common, completedTransactionsCount: 1 });
    const someExperience = service.compute({ ...common, completedTransactionsCount: 4 });
    const established = service.compute({ ...common, completedTransactionsCount: 30 });

    expect(veryNew).toBeLessThan(someExperience);
    expect(someExperience).toBeLessThan(established);
  });

  it("clamps reliability into [0, 10]", () => {
    const veryBad = service.compute({
      averageRating: 0,
      completedTransactionsCount: 0,
      cancellationRate: 50,
      lateReturnRate: 50,
      complaintRate: 50,
      verificationLevel: "BASIC",
      responseTimeScore: 0,
    });
    expect(veryBad).toBeGreaterThanOrEqual(0);
    expect(veryBad).toBeLessThanOrEqual(10);
  });
});
