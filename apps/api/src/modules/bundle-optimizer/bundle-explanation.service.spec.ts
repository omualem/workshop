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
    price: 200,
    distanceKm: 5,
    reliability: 8,
    availability: 10,
    pickupLat: 32.0853,
    pickupLng: 34.7818,
    inventoryCount: 1,
    lenderCompletedTransactions: 50,
    deviationDays: 0,
    m_price: 8,
    m_distance: 8,
    m_reliability: 8,
    m_availability: 10,
    preliminaryScore: 0,
    attributeValues: [],
    reliabilityBreakdown: {
      lenderReliability: 8,
      itemAverageRating: 0,
      itemDistinctRatingCount: 0,
      itemRatingConfidence: 0,
      adjustedItemRating: 3.7,
      itemRatingScore: null,
      insufficientRatingInfo: true,
      finalReliabilityScore: 8,
    },
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
      availability: 0,
    },
    preferences: {
      profile: "balanced",
      sliders: {
        price: 7,
        distance: 7,
        reliability: 7,
        availability: 7,
        pickupSimplicity: 7,
      },
      normalizedWeights: {
        price: 0.25,
        distance: 0.25,
        reliability: 0.25,
        availability: 0.25,
      },
      penaltyMultipliers: {
        pickup: 1,
        lowScore: {
          price: 1,
          distance: 1,
          reliability: 1,
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
        availability: 10,
      }),
      1000,
    );
    expect(result.tradeoffs.some((t) => t.includes("פריט בסיכון"))).toBe(true);
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
        availability: 10,
      }),
      1000,
    );
    expect(result.tradeoffs.some((t) => t.includes("משכיר חדש"))).toBe(true);
  });

  it("does not include condition in metrics, score breakdown, item output, or explanations", () => {
    const result = svc.build(
      buildScored([makeItem()], {
        price: 8,
        distance: 8,
        reliability: 8,
        availability: 9,
      }),
      1000,
    );
    expect(result.metrics).not.toHaveProperty("condition");
    expect(result.lowScorePenaltyBreakdown).not.toHaveProperty("condition");
    expect(result.includedItems[0]).not.toHaveProperty("condition");
    expect([...result.explanations, ...result.tradeoffs].join(" ")).not.toMatch(
      /מצב|condition/i,
    );
  });

  it("emits 'אין עדיין מספיק מידע על דירוג הפריט' when no item ratings exist", () => {
    const result = svc.build(
      buildScored(
        [makeItem({ titleHe: "פריט ללא דירוגים" })],
        { price: 8, distance: 8, reliability: 8, availability: 10 },
      ),
      1000,
    );
    expect(
      result.tradeoffs.some((t) =>
        t.includes("אין עדיין מספיק מידע על דירוג הפריט"),
      ),
    ).toBe(true);
  });

  it("warns about low item-rating confidence when few distinct raters exist", () => {
    const item = makeItem({
      titleHe: "פריט עם דירוג חלש",
      reliabilityBreakdown: {
        lenderReliability: 8,
        itemAverageRating: 5,
        itemDistinctRatingCount: 2,
        itemRatingConfidence: 2 / 30,
        adjustedItemRating: 3.79,
        itemRatingScore: 7.58,
        insufficientRatingInfo: false,
        finalReliabilityScore: 7.87,
      },
    });
    const result = svc.build(
      buildScored([item], { price: 8, distance: 8, reliability: 8, availability: 10 }),
      1000,
    );
    expect(
      result.tradeoffs.some(
        (t) => t.includes("2") && t.includes("הופחתה"),
      ),
    ).toBe(true);
  });

  it("acknowledges full rating confidence when every item has K+ distinct raters", () => {
    const item = makeItem({
      reliabilityBreakdown: {
        lenderReliability: 8,
        itemAverageRating: 4.6,
        itemDistinctRatingCount: 50,
        itemRatingConfidence: 1,
        adjustedItemRating: 4.6,
        itemRatingScore: 9.2,
        insufficientRatingInfo: false,
        finalReliabilityScore: 8.36,
      },
    });
    const result = svc.build(
      buildScored([item], { price: 8, distance: 8, reliability: 8, availability: 10 }),
      1000,
    );
    expect(
      result.explanations.some((e) => e.includes("משקל מלא")),
    ).toBe(true);
  });

  it("exposes per-item reliability breakdown in includedItems", () => {
    const item = makeItem({
      reliabilityBreakdown: {
        lenderReliability: 8,
        itemAverageRating: 4.6,
        itemDistinctRatingCount: 50,
        itemRatingConfidence: 1,
        adjustedItemRating: 4.6,
        itemRatingScore: 9.2,
        insufficientRatingInfo: false,
        finalReliabilityScore: 8.36,
      },
    });
    const result = svc.build(
      buildScored([item], { price: 8, distance: 8, reliability: 8, availability: 9 }),
      1000,
    );
    expect(result.includedItems[0].reliabilityBreakdown).toEqual(
      expect.objectContaining({
        lenderReliability: 8,
        itemDistinctRatingCount: 50,
        itemRatingScore: 9.2,
        insufficientRatingInfo: false,
        finalReliabilityScore: 8.36,
      }),
    );
  });

  it("includes selected preference profile in explanations and scoreBreakdown", () => {
    const result = svc.build(
      buildScored(
        [makeItem()],
        {
          price: 8,
          distance: 8,
          reliability: 8,
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
              availability: 7,
              pickupSimplicity: 5,
            },
            normalizedWeights: {
              price: 10 / 28,
              distance: 6 / 28,
              reliability: 5 / 28,
              availability: 7 / 28,
            },
            penaltyMultipliers: {
              pickup: 5 / 7,
              lowScore: {
                price: 10 / 7,
                distance: 6 / 7,
                reliability: 5 / 7,
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

    expect(result.scoreBreakdown.preferences.profile).toBe("custom");
    expect(result.scoreBreakdown.preferences.baseProfile).toBe("cheapest");
  });
});
