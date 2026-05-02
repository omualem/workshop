import { BundleScoringService } from "./bundle-scoring.service";
import { MetricNormalizationService } from "./metric-normalization.service";
import type { CandidateItem, OptimizerPreferences, SelectedBundle } from "./bundle-optimizer.types";

const PREFS: OptimizerPreferences = {
  weights: { price: 0.25, distance: 0.2, reliability: 0.2, condition: 0.2, availability: 0.15 },
  lambdaVariance: 0.35,
  alphaBottleneck: 0.25,
  betaPickup: 0.4,
  gammaMaxDistance: 0.15,
  alphaDistanceMix: 0.6,
  topKPerSlot: 30,
  beamWidth: 50,
};

function makeItem(over: Partial<CandidateItem> = {}): CandidateItem {
  return {
    slotKey: "slot",
    listingId: "L",
    lenderId: "lender-A",
    pickupKey: "lender-A:1:1",
    titleHe: "פריט",
    titleEn: "Item",
    categoryId: "cat",
    condition: "GOOD",
    price: 200,
    distanceKm: 5,
    reliability: 8,
    conditionScore: 7.5,
    availability: 10,
    pickupLat: 32.0853,
    pickupLng: 34.7818,
    inventoryCount: 1,
    attributeValues: [],
    deviationDays: 0,
    m_price: 8,
    m_distance: 8,
    m_reliability: 8,
    m_condition: 7.5,
    m_availability: 10,
    preliminaryScore: 0,
    ...over,
  };
}

describe("BundleScoringService", () => {
  const norm = new MetricNormalizationService();
  const svc = new BundleScoringService(norm);

  it("variance() computes population variance correctly", () => {
    expect(svc.variance([5, 5, 5])).toBe(0);
    expect(svc.variance([0, 10])).toBe(25);
  });

  it("calculateBottleneckTerm equals α · min_j M_j", () => {
    const m = { price: 6, distance: 8, reliability: 9, condition: 7, availability: 10 };
    expect(svc.calculateBottleneckTerm(m, 0.5)).toBeCloseTo(0.5 * 6);
  });

  it("spatial pickup cost is sum of pairwise pickup distances", () => {
    const items = [
      makeItem({ pickupKey: "A", pickupLat: 32.0, pickupLng: 34.7 }),
      makeItem({ pickupKey: "B", pickupLat: 32.1, pickupLng: 34.7 }),
      makeItem({ pickupKey: "C", pickupLat: 32.0, pickupLng: 34.8 }),
    ];
    const cost = svc.calculatePickupCost(items);
    // 3 unique points → 3 pairwise distances, each ~10 km between Tel Aviv-ish coords
    expect(cost).toBeGreaterThan(0);
    // adding a duplicate pickup must NOT change cost
    const withDup = svc.calculatePickupCost([...items, makeItem({ pickupKey: "A", pickupLat: 32.0, pickupLng: 34.7 })]);
    expect(withDup).toBeCloseTo(cost);
  });

  it("pickup penalty combines spatial cost AND extra-stop count", () => {
    const single: SelectedBundle = { items: [makeItem()], totalPrice: 200, uniqueLenderCount: 1, uniquePickupCount: 1 };
    expect(svc.calculatePickupComplexityPenalty(single, 0, 0.4)).toBe(0);

    const triple: SelectedBundle = {
      items: [makeItem(), makeItem({ pickupKey: "B" }), makeItem({ pickupKey: "C" })],
      totalPrice: 600,
      uniqueLenderCount: 3,
      uniquePickupCount: 3,
    };
    // pickupCost 50km → spatial=2, plus 2 extra stops → β·(2+2) = 0.4·4 = 1.6
    expect(svc.calculatePickupComplexityPenalty(triple, 50, 0.4)).toBeCloseTo(1.6);
  });

  it("max-distance penalty grows with worst pickup distance", () => {
    const small = svc.calculateMaxDistancePenalty(2, 0.15);
    const big = svc.calculateMaxDistancePenalty(60, 0.15);
    expect(big).toBeGreaterThan(small);
    expect(big).toBeLessThanOrEqual(0.15);
  });

  it("distance avg vs max — bundle with one outlier scores worse than balanced when α<1", () => {
    const balanced: SelectedBundle = {
      items: [makeItem({ distanceKm: 10 }), makeItem({ distanceKm: 10 })],
      totalPrice: 400,
      uniqueLenderCount: 1,
      uniquePickupCount: 1,
    };
    const outlier: SelectedBundle = {
      items: [makeItem({ distanceKm: 0 }), makeItem({ distanceKm: 20 })],
      totalPrice: 400,
      uniqueLenderCount: 1,
      uniquePickupCount: 1,
    };
    const a = svc.calculateBundleMetrics(balanced, 1000, 0.6);
    const b = svc.calculateBundleMetrics(outlier, 1000, 0.6);
    // Same average distance but outlier has higher max → distance score lower.
    expect(a.metrics.distance).toBeGreaterThan(b.metrics.distance);
  });

  it("rawFinalScore equals weightedUtility - variance + bottleneck - pickup - maxDist - lowScore", () => {
    const bundle: SelectedBundle = {
      items: [makeItem(), makeItem({ pickupKey: "B", pickupLat: 32.5, pickupLng: 35.0 })],
      totalPrice: 400,
      uniqueLenderCount: 2,
      uniquePickupCount: 2,
    };
    const scored = svc.calculateFinalScore(bundle, PREFS, 1000);
    const {
      weightedUtility,
      variancePenalty,
      bottleneckTerm,
      pickupPenalty,
      maxDistancePenalty,
      lowScorePenalty,
      rawFinalScore,
      finalScore,
    } = scored.breakdown;
    expect(rawFinalScore).toBeCloseTo(
      weightedUtility -
        variancePenalty +
        bottleneckTerm -
        pickupPenalty -
        maxDistancePenalty -
        lowScorePenalty,
    );
    // finalScore is the clamped form of rawFinalScore.
    expect(finalScore).toBeGreaterThanOrEqual(0);
    expect(finalScore).toBeLessThanOrEqual(10);
  });

  it("lowScorePenalty is 0 when every metric is above its threshold", () => {
    const metrics = {
      price: 8,
      distance: 8,
      reliability: 9,
      condition: 9,
      availability: 9.5,
    };
    const { total, breakdown } = svc.calculateLowScorePenalty(metrics);
    expect(total).toBe(0);
    expect(breakdown.condition).toBe(0);
    expect(breakdown.reliability).toBe(0);
  });

  it("lowScorePenalty grows when condition drops below threshold", () => {
    const high = svc.calculateLowScorePenalty({
      price: 8,
      distance: 8,
      reliability: 9,
      condition: 9,
      availability: 9.5,
    });
    const low = svc.calculateLowScorePenalty({
      price: 8,
      distance: 8,
      reliability: 9,
      condition: 3,
      availability: 9.5,
    });
    expect(low.total).toBeGreaterThan(high.total);
    // condition weight 0.7 · max(0, 6.5 - 3) = 2.45
    expect(low.breakdown.condition).toBeCloseTo(0.7 * 3.5);
  });

  it("lowScorePenalty grows when reliability drops below threshold", () => {
    const high = svc.calculateLowScorePenalty({
      price: 8,
      distance: 8,
      reliability: 9,
      condition: 9,
      availability: 9.5,
    });
    const low = svc.calculateLowScorePenalty({
      price: 8,
      distance: 8,
      reliability: 4,
      condition: 9,
      availability: 9.5,
    });
    expect(low.total).toBeGreaterThan(high.total);
    expect(low.breakdown.reliability).toBeCloseTo(0.65 * 2.5);
  });

  it("finalScore is clamped to [0, 10] even when penalties are crushing", () => {
    const awful: SelectedBundle = {
      items: [
        makeItem({
          m_price: 0,
          m_distance: 0,
          m_reliability: 0,
          m_condition: 0,
          m_availability: 0,
          condition: "HEAVY_USE",
          conditionScore: 2,
          distanceKm: 200,
          pickupKey: "X",
          pickupLat: 35.0,
          pickupLng: 31.0,
        }),
        makeItem({
          m_price: 0,
          m_distance: 0,
          m_reliability: 0,
          m_condition: 0,
          m_availability: 0,
          condition: "HEAVY_USE",
          conditionScore: 2,
          distanceKm: 200,
          pickupKey: "Y",
          pickupLat: 30.0,
          pickupLng: 35.5,
        }),
      ],
      totalPrice: 1000,
      uniqueLenderCount: 2,
      uniquePickupCount: 2,
    };
    const scored = svc.calculateFinalScore(awful, PREFS, 1000);
    expect(scored.breakdown.finalScore).toBeGreaterThanOrEqual(0);
    expect(scored.breakdown.finalScore).toBeLessThanOrEqual(10);
    expect(scored.breakdown.rawFinalScore).toBeLessThan(scored.breakdown.finalScore + 1e-6);
  });

  it("bundle condition uses 0.6·avg + 0.4·min", () => {
    const bundle: SelectedBundle = {
      items: [
        makeItem({ m_condition: 10, conditionScore: 10, condition: "NEW" }),
        makeItem({ m_condition: 10, conditionScore: 10, condition: "NEW" }),
        makeItem({ m_condition: 2, conditionScore: 2, condition: "HEAVY_USE" }),
      ],
      totalPrice: 600,
      uniqueLenderCount: 1,
      uniquePickupCount: 1,
    };
    const { metrics } = svc.calculateBundleMetrics(bundle, 1000, 0.6);
    // average = 22/3 ≈ 7.333; min = 2
    // 0.6 · 7.333 + 0.4 · 2 = 4.4 + 0.8 = 5.2
    expect(metrics.condition).toBeCloseTo(5.2, 2);
  });

  it("prefers a balanced bundle over an imbalanced one", () => {
    const balanced: SelectedBundle = {
      items: [makeItem({ m_price: 7, m_distance: 7, m_reliability: 7, m_condition: 7, m_availability: 7 })],
      totalPrice: 200,
      uniqueLenderCount: 1,
      uniquePickupCount: 1,
    };
    const imbalanced: SelectedBundle = {
      items: [makeItem({ m_price: 10, m_distance: 10, m_reliability: 4, m_condition: 4, m_availability: 7 })],
      totalPrice: 200,
      uniqueLenderCount: 1,
      uniquePickupCount: 1,
    };
    const a = svc.calculateFinalScore(balanced, PREFS, 1000);
    const b = svc.calculateFinalScore(imbalanced, PREFS, 1000);
    expect(a.breakdown.finalScore).toBeGreaterThan(b.breakdown.finalScore);
  });
});
