import { BundleExplanationService } from "./bundle-explanation.service";

describe("BundleExplanationService", () => {
  it("includes chips and tradeoffs for weak logistics", () => {
    const service = new BundleExplanationService();
    const explanation = service.build({
      finalScore: 7.9,
      priceScore: 9.1,
      reliabilityScore: 7.3,
      logisticsScore: 4.8,
      availabilityScore: 8.2,
      productQualityScore: 7.1,
      stabilityScore: 6.4,
      totalPrice: 710,
      totalDistanceKm: 15.2,
      pickupPointsCount: 3,
      lendersCount: 3,
      exactAvailabilityFit: true,
      weakDimensions: ["logistics"],
    });

    expect(explanation.he.tradeoffs).toContain("נוחות האיסוף נמוכה יחסית");
    expect(explanation.chips).toContain("budget-friendly");
  });
});
