import { MetricNormalizationService } from "./metric-normalization.service";

describe("MetricNormalizationService", () => {
  const svc = new MetricNormalizationService();

  describe("normalizeDistanceScore", () => {
    it("returns 10 at 0 km", () => {
      expect(svc.normalizeDistanceScore(0)).toBe(10);
    });

    it("decreases monotonically", () => {
      const near = svc.normalizeDistanceScore(5);
      const mid = svc.normalizeDistanceScore(20);
      const far = svc.normalizeDistanceScore(100);
      expect(near).toBeGreaterThan(mid);
      expect(mid).toBeGreaterThan(far);
    });
  });

  describe("bundlePriceScore", () => {
    it("is 10 for free bundles and 0 for full-budget bundles", () => {
      expect(svc.bundlePriceScore(0, 1000)).toBe(10);
      expect(svc.bundlePriceScore(1000, 1000)).toBe(0);
    });

    it("interpolates linearly inside the budget", () => {
      expect(svc.bundlePriceScore(500, 1000)).toBe(5);
    });
  });

  describe("availabilityFromDeviation", () => {
    it("returns 10 for an exact match", () => {
      expect(svc.availabilityFromDeviation(0)).toBe(10);
    });

    it("decreases linearly with deviation", () => {
      expect(svc.availabilityFromDeviation(1)).toBe(8);
      expect(svc.availabilityFromDeviation(3)).toBe(4);
    });
  });

  describe("bundleDistanceScore", () => {
    it("equals normalizeDistanceScore(avg) when alphaMix=1", () => {
      expect(svc.bundleDistanceScore(10, 30, 1)).toBeCloseTo(
        svc.normalizeDistanceScore(10),
      );
    });

    it("equals normalizeDistanceScore(max) when alphaMix=0", () => {
      expect(svc.bundleDistanceScore(10, 30, 0)).toBeCloseTo(
        svc.normalizeDistanceScore(30),
      );
    });
  });
});
