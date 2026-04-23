import { PricingService } from "./pricing.service";

describe("PricingService", () => {
  const service = new PricingService({} as any);

  it("applies duration discount rules", () => {
    const result = service.computeListingPrice(
      {
        basePriceDaily: 100,
        pricingRules: [{ ruleType: "DURATION_DISCOUNT", minDays: 3, maxDays: null, percentDiscount: 10, fixedOverride: null, weekendAdjustment: null, seasonalAdjustment: null }],
      } as any,
      new Date("2026-05-01"),
      new Date("2026-05-04"),
      1,
    );

    expect(result.total).toBe(270);
    expect(result.days).toBe(3);
  });
});
