import { BundleScoringService } from "./bundle-scoring.service";
import { MetricNormalizationService } from "./metric-normalization.service";
import { PreferenceMappingService } from "./preference-mapping.service";
import type {
  CandidateItem,
  OptimizerPreferences,
  SelectedBundle,
} from "./bundle-optimizer.types";

const PREFS: OptimizerPreferences = {
  weights: { price: 0.25, distance: 0.25, reliability: 0.25, availability: 0.25 },
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
    price: 200,
    distanceKm: 5,
    reliability: 8,
    availability: 10,
    pickupLat: 32.0853,
    pickupLng: 34.7818,
    inventoryCount: 1,
    attributeValues: [],
    deviationDays: 0,
    m_price: 8,
    m_distance: 8,
    m_reliability: 8,
    m_availability: 10,
    preliminaryScore: 0,
    ...over,
  };
}

describe("BundleScoringService", () => {
  const svc = new BundleScoringService(new MetricNormalizationService());
  const preferenceMapping = new PreferenceMappingService();

  it("calculateBottleneckTerm equals alpha times the weakest 4D metric", () => {
    const metrics = { price: 6, distance: 8, reliability: 9, availability: 10 };
    expect(svc.calculateBottleneckTerm(metrics, 0.5)).toBeCloseTo(3);
  });

  it("scoreBreakdown has no condition field", () => {
    const bundle: SelectedBundle = {
      items: [makeItem()],
      totalPrice: 200,
      uniqueLenderCount: 1,
      uniquePickupCount: 1,
    };
    const scored = svc.calculateFinalScore(bundle, PREFS, 1000);
    expect(scored.metrics).not.toHaveProperty("condition");
    expect(scored.breakdown.lowScorePenaltyBreakdown).not.toHaveProperty(
      "condition",
    );
    expect(scored.breakdown.preferences.normalizedWeights).not.toHaveProperty(
      "condition",
    );
  });

  it("lowScorePenalty is 0 when every metric is above threshold", () => {
    const { total, breakdown } = svc.calculateLowScorePenalty({
      price: 8,
      distance: 8,
      reliability: 9,
      availability: 9.5,
    });
    expect(total).toBe(0);
    expect(breakdown.reliability).toBe(0);
  });

  it("lowScorePenalty grows when reliability drops below threshold", () => {
    const high = svc.calculateLowScorePenalty({
      price: 8,
      distance: 8,
      reliability: 9,
      availability: 9.5,
    });
    const low = svc.calculateLowScorePenalty({
      price: 8,
      distance: 8,
      reliability: 4,
      availability: 9.5,
    });
    expect(low.total).toBeGreaterThan(high.total);
    expect(low.breakdown.reliability).toBeCloseTo(0.65 * 2.5);
    expect(low.breakdown).not.toHaveProperty("condition");
  });

  it("finalScore is clamped to [0, 10] even when penalties are crushing", () => {
    const awful: SelectedBundle = {
      items: [
        makeItem({
          m_price: 0,
          m_distance: 0,
          m_reliability: 0,
          m_availability: 0,
          distanceKm: 200,
          pickupKey: "X",
          pickupLat: 35.0,
          pickupLng: 31.0,
        }),
        makeItem({
          m_price: 0,
          m_distance: 0,
          m_reliability: 0,
          m_availability: 0,
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
  });

  it("custom sliders affect ranking between cheap and professional bundles", () => {
    const cheaper: SelectedBundle = {
      items: [makeItem({ price: 80, m_reliability: 5.5, m_availability: 7 })],
      totalPrice: 80,
      uniqueLenderCount: 1,
      uniquePickupCount: 1,
    };
    const moreReliable: SelectedBundle = {
      items: [makeItem({ price: 200, m_reliability: 10, m_availability: 10 })],
      totalPrice: 200,
      uniqueLenderCount: 1,
      uniquePickupCount: 1,
    };

    const priceHeavy = preferenceMapping.resolvePreferences({
      preferenceProfile: "custom",
      basePreferenceProfile: "cheapest",
      preferenceSliders: {
        price: 10,
        distance: 1,
        reliability: 1,
        availability: 1,
        pickupSimplicity: 5,
      },
    });
    const professional = preferenceMapping.resolvePreferences({
      preferenceProfile: "custom",
      basePreferenceProfile: "professional",
      preferenceSliders: {
        price: 2,
        distance: 4,
        reliability: 10,
        availability: 9,
        pickupSimplicity: 5,
      },
    });

    expect(
      svc.calculateFinalScore(
        cheaper,
        { ...PREFS, weights: priceHeavy.weights },
        500,
        priceHeavy,
      ).breakdown.finalScore,
    ).toBeGreaterThan(
      svc.calculateFinalScore(
        moreReliable,
        { ...PREFS, weights: priceHeavy.weights },
        500,
        priceHeavy,
      ).breakdown.finalScore,
    );
    expect(
      svc.calculateFinalScore(
        moreReliable,
        { ...PREFS, weights: professional.weights },
        500,
        professional,
      ).breakdown.finalScore,
    ).toBeGreaterThan(
      svc.calculateFinalScore(
        cheaper,
        { ...PREFS, weights: professional.weights },
        500,
        professional,
      ).breakdown.finalScore,
    );
  });
});
