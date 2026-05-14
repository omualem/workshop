import { BundleExplanationService } from "./bundle-explanation.service";
import type {
  CandidateItem,
  ScoreBreakdown,
  ScoredBundle,
} from "./bundle-optimizer.types";

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
    lenderCompletedTransactions: 50,
    deviationDays: 0,
    m_price: 8,
    m_distance: 8,
    m_reliability: 8,
    m_condition: 7.5,
    m_availability: 10,
    preliminaryScore: 0,
    attributeValues: [],
    ...over,
  };
}

function buildScored(
  items: CandidateItem[],
  metrics: ScoredBundle["metrics"],
  overrides: Partial<ScoreBreakdown> = {},
): ScoredBundle {
  const breakdown: ScoreBreakdown = {
    weightedUtility: 7,
    variancePenalty: 0.2,
    bottleneckTerm: 1,
    pickupPenalty: 0,
    maxDistancePenalty: 0,
    lowScorePenalty: 0,
    lowScorePenaltyBreakdown: {
      price: 0,
      distance: 0,
      reliability: 0,
      condition: 0,
      availability: 0,
    },
    preferences: {
      profile: "balanced",
      sliders: {
        price: 7,
        distance: 7,
        reliability: 7,
        condition: 7,
        availability: 7,
        pickupSimplicity: 7,
      },
      normalizedWeights: {
        price: 0.2,
        distance: 0.2,
        reliability: 0.2,
        condition: 0.2,
        availability: 0.2,
      },
      penaltyMultipliers: {
        pickup: 1,
        lowScore: {
          price: 1,
          distance: 1,
          reliability: 1,
          condition: 1,
          availability: 1,
        },
        maxDistance: 1,
        variance: 1,
        bottleneck: 1,
      },
    },
    rawFinalScore: 7.8,
    finalScore: 7.8,
    ...overrides,
  };
  return {
    bundle: {
      items,
      totalPrice: items.reduce((s, i) => s + i.price, 0),
      uniqueLenderCount: new Set(items.map((i) => i.lenderId)).size,
      uniquePickupCount: new Set(items.map((i) => i.pickupKey)).size,
    },
    metrics,
    derived: {
      avgDistance: 5,
      maxDistance: 5,
      pickupCost: 0,
      pickupStops: 1,
      deviationDaysSum: 0,
    },
    breakdown,
  };
}

describe("BundleExplanationService", () => {
  const svc = new BundleExplanationService();

  it("names the weakest item in a low-condition tradeoff", () => {
    const items = [
      makeItem({ titleHe: "פריט טוב", m_condition: 9 }),
      makeItem({ titleHe: "פריט שחוק", m_condition: 2, listingId: "L2" }),
    ];
    const result = svc.build(
      buildScored(items, {
        price: 8,
        distance: 8,
        reliability: 8,
        condition: 5,
        availability: 10,
      }),
      1000,
    );
    const matched = result.tradeoffs.find((t) => t.includes("פריט שחוק"));
    expect(matched).toBeDefined();
  });

  it("names the weakest lender in a low-reliability tradeoff", () => {
    const items = [
      makeItem({ titleHe: "פריט אמין", m_reliability: 9 }),
      makeItem({ titleHe: "פריט בסיכון", m_reliability: 3, listingId: "L2" }),
    ];
    const result = svc.build(
      buildScored(items, {
        price: 8,
        distance: 8,
        reliability: 5,
        condition: 8,
        availability: 10,
      }),
      1000,
    );
    const matched = result.tradeoffs.find((t) => t.includes("פריט בסיכון"));
    expect(matched).toBeDefined();
  });

  it("warns about new lenders even when ratings look fine", () => {
    const items = [
      makeItem({ lenderCompletedTransactions: 50 }),
      makeItem({
        lenderCompletedTransactions: 1,
        listingId: "L2",
        lenderId: "lender-B",
        pickupKey: "lender-B:1:1",
      }),
    ];
    const result = svc.build(
      buildScored(items, {
        price: 8,
        distance: 8,
        reliability: 8,
        condition: 8,
        availability: 10,
      }),
      1000,
    );
    expect(
      result.tradeoffs.some((t) => t.includes("משכיר חדש")),
    ).toBe(true);
  });

  it("includes lowScorePenalty fields in scoreBreakdown", () => {
    const items = [makeItem()];
    const result = svc.build(
      buildScored(
        items,
        {
          price: 8,
          distance: 8,
          reliability: 8,
          condition: 8,
          availability: 9,
        },
        {
          lowScorePenalty: 1.2,
          rawFinalScore: 8.4,
          finalScore: 8.4,
        },
      ),
      1000,
    );
    expect(result.scoreBreakdown.lowScorePenalty).toBe(1.2);
    expect(result.scoreBreakdown.rawFinalScore).toBe(8.4);
    expect(result.lowScorePenaltyBreakdown).toBeDefined();
  });

  it("includes selected preference profile in explanations and scoreBreakdown", () => {
    const result = svc.build(
      buildScored(
        [makeItem()],
        {
          price: 8,
          distance: 8,
          reliability: 8,
          condition: 8,
          availability: 9,
        },
        {
          preferences: {
            profile: "custom",
            baseProfile: "cheapest",
            sliders: {
              price: 10,
              distance: 6,
              reliability: 5,
              condition: 4,
              availability: 7,
              pickupSimplicity: 5,
            },
            normalizedWeights: {
              price: 10 / 32,
              distance: 6 / 32,
              reliability: 5 / 32,
              condition: 4 / 32,
              availability: 7 / 32,
            },
            penaltyMultipliers: {
              pickup: 5 / 7,
              lowScore: {
                price: 10 / 7,
                distance: 6 / 7,
                reliability: 5 / 7,
                condition: 4 / 7,
                availability: 1,
              },
              maxDistance: 6 / 7,
              variance: 1,
              bottleneck: 0.95,
            },
          },
        },
      ),
      1000,
    );

    expect(result.explanations).toContain(
      "הדירוג חושב לפי המשקלים שהוגדרו ידנית.",
    );
    expect(result.scoreBreakdown.preferences.profile).toBe("custom");
    expect(result.scoreBreakdown.preferences.baseProfile).toBe("cheapest");
  });
});
