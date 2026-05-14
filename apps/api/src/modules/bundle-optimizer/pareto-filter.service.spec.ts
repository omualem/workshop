import { ParetoFilterService } from "./pareto-filter.service";
import type { ScoredBundle } from "./bundle-optimizer.types";

function bundle(price: number, distance: number, reliability: number, condition: number, availability: number): ScoredBundle {
  return {
    bundle: { items: [], totalPrice: 0, uniqueLenderCount: 0, uniquePickupCount: 0 },
    metrics: { price, distance, reliability, condition, availability },
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
      rawFinalScore: price + distance + reliability + condition + availability,
      finalScore: price + distance + reliability + condition + availability,
    },
  };
}

describe("ParetoFilterService", () => {
  const svc = new ParetoFilterService();

  it("removes a strictly dominated bundle", () => {
    const A = bundle(9, 9, 9, 9, 9);
    const B = bundle(5, 5, 5, 5, 5); // dominated by A
    const { kept, removedCount } = svc.filter([A, B]);
    expect(kept).toContain(A);
    expect(kept).not.toContain(B);
    expect(removedCount).toBe(1);
  });

  it("keeps both bundles when neither dominates the other", () => {
    const cheap = bundle(10, 5, 5, 5, 5);  // best price, worse elsewhere
    const reliable = bundle(5, 5, 10, 5, 5); // best reliability, worse on price
    const { kept } = svc.filter([cheap, reliable]);
    expect(kept).toContain(cheap);
    expect(kept).toContain(reliable);
  });

  it("dominates() requires strict superiority on at least one dimension", () => {
    const A = bundle(7, 7, 7, 7, 7);
    const Aclone = bundle(7, 7, 7, 7, 7);
    expect(svc.dominates(A, Aclone)).toBe(false);
    expect(svc.dominates(Aclone, A)).toBe(false);
  });
});
