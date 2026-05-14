import { BundleOptimizerService } from "./bundle-optimizer.service";
import { PreferenceMappingService } from "./preference-mapping.service";
import type { OptimizerRequest, SlotInput } from "./bundle-optimizer.types";

const prefs = {
  weights: { price: 0.2, distance: 0.2, reliability: 0.2, condition: 0.2, availability: 0.2 },
  lambdaVariance: 0.35,
  alphaBottleneck: 0.25,
  betaPickup: 0.4,
  gammaMaxDistance: 0.15,
  alphaDistanceMix: 0.6,
  topKPerSlot: 30,
  beamWidth: 50,
};
const preferenceMapping = new PreferenceMappingService();

function request(slots: SlotInput[], over: Partial<OptimizerRequest> = {}): OptimizerRequest {
  return {
    slots,
    dateRange: { startDate: "2026-06-01", endDate: "2026-06-03" },
    userLocation: { lat: 32.0853, lng: 34.7818, address: "תל אביב" },
    budget: 1000,
    preferences: prefs,
    ...over,
  };
}

describe("BundleOptimizerService", () => {
  it("returns no feasible bundle with Hebrew message and slot-specific failure when one slot has zero candidates", async () => {
    const slots: SlotInput[] = [
      { slotKey: "slot-1", mode: "category", categoryId: "cat-1", quantity: 1 },
      { slotKey: "slot-2", mode: "category", categoryId: "cat-empty", quantity: 1 },
    ];
    const counts = {
      beforeFiltering: { "slot-1": 1, "slot-2": 0 },
      afterFiltering: { "slot-1": 1, "slot-2": 0 },
      afterTopK: { "slot-1": 1, "slot-2": 0 },
    };
    const candidateFilter = {
      buildCandidatesPerSlot: jest.fn(async () => ({
        candidatesBySlot: { "slot-1": [{}], "slot-2": [] },
        counts,
        expandedSlots: slots,
      })),
      findEmptySlot: jest.fn(() => slots[1]),
    };
    const service = new BundleOptimizerService(
      candidateFilter as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      { geocodeRenterAddress: jest.fn() } as any,
      preferenceMapping,
    );

    const result = (await service.optimize(request(slots))) as any;

    expect(result.data.bundles).toEqual([]);
    expect(result.data.messageHe).toBe("לא נמצאה חבילה שעומדת בכל האילוצים");
    expect(result.data.suggestions).toContain("לא נמצאו פריטים זמינים עבור הסלוט: slot-2");
  });

  it("includes max pickup suggestion when the pickup cap blocks all bundles", async () => {
    const slots: SlotInput[] = [
      { slotKey: "slot-1", mode: "category", categoryId: "cat-1", quantity: 1 },
    ];
    const counts = {
      beforeFiltering: { "slot-1": 1 },
      afterFiltering: { "slot-1": 1 },
      afterTopK: { "slot-1": 1 },
    };
    const candidateFilter = {
      buildCandidatesPerSlot: jest.fn(async () => ({
        candidatesBySlot: { "slot-1": [{}] },
        counts,
        expandedSlots: slots,
      })),
      findEmptySlot: jest.fn(() => undefined),
    };
    const beamSearch = {
      search: jest.fn(() => ({
        bundles: [],
        stats: {
          expanded: 1,
          prunedByBudget: 0,
          prunedByEarlyBound: 0,
          prunedByPickupCap: 1,
          prunedByInventory: 0,
          beamRetained: 0,
          finalBundles: 0,
        },
      })),
    };
    const service = new BundleOptimizerService(
      candidateFilter as any,
      beamSearch as any,
      {} as any,
      {} as any,
      {} as any,
      { geocodeRenterAddress: jest.fn() } as any,
      preferenceMapping,
    );

    const result = (await service.optimize(request(slots, { maxPickupPoints: 1 }))) as any;

    expect(beamSearch.search).toHaveBeenCalledWith(
      slots,
      { "slot-1": [{}] },
      1000,
      prefs,
      1,
    );
    expect(result.data.suggestions).toContain("נסה להגדיל את מספר נקודות האיסוף המותר");
  });

  it("resolves renter location once via geocoding when given city/street selector", async () => {
    const slots: SlotInput[] = [
      { slotKey: "slot-1", mode: "category", categoryId: "cat-1", quantity: 1 },
    ];
    const counts = {
      beforeFiltering: { "slot-1": 1 },
      afterFiltering: { "slot-1": 1 },
      afterTopK: { "slot-1": 1 },
    };
    const candidateFilter = {
      buildCandidatesPerSlot: jest.fn(async (req: OptimizerRequest) => {
        // Verify the optimizer pre-resolved renter location to coordinates
        // before reaching the candidate-filter stage.
        expect(req.userLocation.lat).toBe(32.5);
        expect(req.userLocation.lng).toBe(34.9);
        return {
          candidatesBySlot: { "slot-1": [] },
          counts,
          expandedSlots: slots,
        };
      }),
      findEmptySlot: jest.fn(() => slots[0]),
    };
    const addresses = {
      geocodeRenterAddress: jest
        .fn()
        .mockResolvedValue({
          lat: 32.5,
          lng: 34.9,
          addressText: "הרצל 12, תל אביב",
          cached: false,
          provider: "nominatim",
        }),
    };
    const service = new BundleOptimizerService(
      candidateFilter as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      addresses as any,
      preferenceMapping,
    );

    await service.optimize(
      request(slots, {
        userLocation: {
          cityId: "c1",
          streetId: "s1",
          addressNumber: 12,
        } as any,
      }),
    );

    expect(addresses.geocodeRenterAddress).toHaveBeenCalledTimes(1);
  });
});
