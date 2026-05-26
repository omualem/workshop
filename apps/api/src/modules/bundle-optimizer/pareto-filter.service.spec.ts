import { ParetoFilterService } from "./pareto-filter.service";
import type { ScoredBundle } from "./bundle-optimizer.types";

function bundle(
  price: number,
  distance: number,
  reliability: number,
  availability: number,
): ScoredBundle {
  const score = price + distance + reliability + availability;
  return {
    bundle: { items: [], totalPrice: 0, uniqueLenderCount: 0, uniquePickupCount: 0 },
    metrics: { price, distance, reliability, availability },
    derived: { avgDistance: 0, maxDistance: 0, pickupCost: 0, pickupStops: 0, deviationDaysSum: 0 },
    breakdown: {
      weightedUtility: 0,
      variancePenalty: 0,
      bottleneckTerm: 0,
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
      rawFinalScore: score,
      finalScore: score,
    },
  };
}

describe("ParetoFilterService", () => {
  const svc = new ParetoFilterService();

  it("removes a strictly dominated bundle", () => {
    const a = bundle(9, 9, 9, 9);
    const b = bundle(5, 5, 5, 5);
    const { kept, removedCount } = svc.filter([a, b]);
    expect(kept).toContain(a);
    expect(kept).not.toContain(b);
    expect(removedCount).toBe(1);
  });

  it("keeps both bundles when neither dominates the other", () => {
    const cheap = bundle(10, 5, 5, 5);
    const reliable = bundle(5, 5, 10, 5);
    const { kept } = svc.filter([cheap, reliable]);
    expect(kept).toContain(cheap);
    expect(kept).toContain(reliable);
  });
});
