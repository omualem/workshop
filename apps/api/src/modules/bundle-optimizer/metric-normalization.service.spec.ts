import { MetricNormalizationService } from "./metric-normalization.service";

describe("MetricNormalizationService", () => {
  const svc = new MetricNormalizationService();

  describe("normalizePriceScore", () => {
    it("returns 10 for the cheapest, 0 for the most expensive", () => {
      expect(svc.normalizePriceScore(100, 100, 500)).toBe(10);
      expect(svc.normalizePriceScore(500, 100, 500)).toBe(0);
    });
    it("interpolates linearly", () => {
      expect(svc.normalizePriceScore(300, 100, 500)).toBe(5);
    });
    it("clamps to [0,10]", () => {
      expect(svc.normalizePriceScore(50, 100, 500)).toBe(10);
      expect(svc.normalizePriceScore(900, 100, 500)).toBe(0);
    });
    it("returns 10 for a degenerate pool", () => {
      expect(svc.normalizePriceScore(100, 100, 100)).toBe(10);
    });
  });

  describe("normalizeDistanceScore", () => {
    it("returns 10 at 0 km", () => {
      expect(svc.normalizeDistanceScore(0)).toBe(10);
    });
    it("decreases monotonically", () => {
      const a = svc.normalizeDistanceScore(5);
      const b = svc.normalizeDistanceScore(20);
      const c = svc.normalizeDistanceScore(100);
      expect(a).toBeGreaterThan(b);
      expect(b).toBeGreaterThan(c);
    });
    it("stays in [0,10]", () => {
      expect(svc.normalizeDistanceScore(1000)).toBeGreaterThanOrEqual(0);
      expect(svc.normalizeDistanceScore(1000)).toBeLessThanOrEqual(10);
    });
  });

  describe("normalizeConditionScore", () => {
    it("orders NEW > LIKE_NEW > GOOD > FAIR > HEAVY_USE", () => {
      expect(svc.normalizeConditionScore("NEW")).toBeGreaterThan(svc.normalizeConditionScore("LIKE_NEW"));
      expect(svc.normalizeConditionScore("LIKE_NEW")).toBeGreaterThan(svc.normalizeConditionScore("GOOD"));
      expect(svc.normalizeConditionScore("GOOD")).toBeGreaterThan(svc.normalizeConditionScore("FAIR"));
      expect(svc.normalizeConditionScore("FAIR")).toBeGreaterThan(svc.normalizeConditionScore("HEAVY_USE"));
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
    it("clamps to [0,10]", () => {
      expect(svc.availabilityFromDeviation(100)).toBe(0);
      expect(svc.availabilityFromDeviation(-5)).toBe(10);
    });
  });

  describe("bundleDistanceScore (avg + max mix)", () => {
    it("equals normalizeDistanceScore(avg) when alphaMix=1", () => {
      expect(svc.bundleDistanceScore(10, 30, 1)).toBeCloseTo(svc.normalizeDistanceScore(10));
    });
    it("equals normalizeDistanceScore(max) when alphaMix=0", () => {
      expect(svc.bundleDistanceScore(10, 30, 0)).toBeCloseTo(svc.normalizeDistanceScore(30));
    });
    it("penalizes outliers more as alphaMix decreases", () => {
      const lenient = svc.bundleDistanceScore(5, 50, 1);
      const strict = svc.bundleDistanceScore(5, 50, 0);
      expect(lenient).toBeGreaterThan(strict);
    });
  });
});
