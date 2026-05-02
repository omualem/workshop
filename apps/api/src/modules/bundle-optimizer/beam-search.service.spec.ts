import { BeamSearchService } from "./beam-search.service";
import { BundleScoringService } from "./bundle-scoring.service";
import { MetricNormalizationService } from "./metric-normalization.service";
import type { CandidateItem, OptimizerPreferences, SlotInput } from "./bundle-optimizer.types";

const PREFS: OptimizerPreferences = {
  weights: { price: 0.25, distance: 0.2, reliability: 0.2, condition: 0.2, availability: 0.15 },
  lambdaVariance: 0.35,
  alphaBottleneck: 0.25,
  betaPickup: 0.4,
  gammaMaxDistance: 0.15,
  alphaDistanceMix: 0.6,
  topKPerSlot: 30,
  beamWidth: 3,
};

function cand(
  slotKey: string,
  id: string,
  price: number,
  prelim: number,
  over: Partial<CandidateItem> = {},
): CandidateItem {
  return {
    slotKey,
    listingId: id,
    lenderId: "lender-" + id,
    pickupKey: id,
    titleHe: id,
    titleEn: id,
    categoryId: "cat",
    condition: "GOOD",
    price,
    distanceKm: 5,
    reliability: 8,
    conditionScore: 7.5,
    availability: 10,
    pickupLat: 32 + Math.random() * 0.1,
    pickupLng: 34.7 + Math.random() * 0.1,
    inventoryCount: 1,
    attributeValues: [],
    deviationDays: 0,
    m_price: 8,
    m_distance: 8,
    m_reliability: 8,
    m_condition: 7.5,
    m_availability: 10,
    preliminaryScore: prelim,
    ...over,
  };
}

describe("BeamSearchService", () => {
  const norm = new MetricNormalizationService();
  const scoring = new BundleScoringService(norm);
  const beam = new BeamSearchService(scoring);

  const slots: SlotInput[] = [
    { slotKey: "s1", mode: "category", categoryId: "c", quantity: 1 },
    { slotKey: "s2", mode: "category", categoryId: "c", quantity: 1 },
  ];

  it("returns no bundles when a slot has zero candidates", () => {
    const { bundles } = beam.search(slots, { s1: [cand("s1", "A", 100, 5)], s2: [] }, 1000, PREFS);
    expect(bundles).toEqual([]);
  });

  it("filters bundles that exceed the budget", () => {
    const { bundles } = beam.search(
      slots,
      {
        s1: [cand("s1", "A", 800, 5)],
        s2: [cand("s2", "B", 800, 5), cand("s2", "C", 100, 5)],
      },
      1000,
      PREFS,
    );
    expect(bundles.length).toBe(1);
    expect(bundles[0].totalPrice).toBe(900);
  });

  it("keeps at most beamWidth partial bundles per layer", () => {
    const s1Cands = Array.from({ length: 10 }, (_, i) => cand("s1", `A${i}`, 100, 10 - i));
    const s2Cands = Array.from({ length: 10 }, (_, i) => cand("s2", `B${i}`, 100, 10 - i));
    const { bundles } = beam.search(slots, { s1: s1Cands, s2: s2Cands }, 1000, { ...PREFS, beamWidth: 3 });
    expect(bundles.length).toBeLessThanOrEqual(3);
  });

  it("enforces maxPickupPoints as a hard cap", () => {
    const { bundles, stats } = beam.search(
      slots,
      {
        s1: [cand("s1", "A", 100, 5, { pickupKey: "pickup-A" })],
        s2: [cand("s2", "B", 100, 5, { pickupKey: "pickup-B" })],
      },
      1000,
      PREFS,
      1,
    );
    expect(bundles).toEqual([]);
    expect(stats.prunedByPickupCap).toBeGreaterThan(0);
  });

  it("does not reuse a listing more times than inventoryCount across expanded slots", () => {
    const { bundles, stats } = beam.search(
      slots,
      {
        s1: [cand("s1", "A", 100, 5, { inventoryCount: 1 })],
        s2: [
          cand("s2", "A", 100, 10, { inventoryCount: 1 }),
          cand("s2", "B", 150, 1, { inventoryCount: 1 }),
        ],
      },
      1000,
      PREFS,
    );
    expect(stats.prunedByInventory).toBeGreaterThan(0);
    expect(bundles).toHaveLength(1);
    expect(bundles[0].items.map((item) => item.listingId)).toEqual(["A", "B"]);
  });

  it("reports early-pruning hits when budget cannot be reached", () => {
    // Slot 1 has expensive options; slot 2 cheapest is 600. Pairing the
    // expensive one with the cheapest still busts a 1000 budget — caught
    // by the lower-bound pruner.
    const s1Expensive = [cand("s1", "X", 700, 5), cand("s1", "Y", 200, 5)];
    const s2 = [cand("s2", "Z", 600, 5)];
    const { stats, bundles } = beam.search(slots, { s1: s1Expensive, s2 }, 1000, PREFS);
    // Only "Y + Z" = 800 fits; "X + Z" = 1300 must be pruned somewhere.
    expect(bundles.length).toBe(1);
    expect(bundles[0].totalPrice).toBe(800);
    expect(stats.prunedByEarlyBound + stats.prunedByBudget).toBeGreaterThan(0);
  });

  it("canExtendBundle returns false when even cheapest remaining busts budget", () => {
    expect(beam.canExtendBundle(800, 300, 1000)).toBe(false);
    expect(beam.canExtendBundle(400, 300, 1000)).toBe(true);
  });
});
