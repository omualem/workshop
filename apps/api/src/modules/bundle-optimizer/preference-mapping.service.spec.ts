import { optimizerRequestSchema } from "./bundle-optimizer.types";
import { PreferenceMappingService } from "./preference-mapping.service";

describe("PreferenceMappingService", () => {
  const svc = new PreferenceMappingService();

  it("balanced sliders produce equal normalized weights", () => {
    const prefs = svc.resolvePreferences({ preferenceProfile: "balanced" });
    expect(prefs.weights.price).toBeCloseTo(0.2);
    expect(prefs.weights.distance).toBeCloseTo(0.2);
    expect(prefs.weights.reliability).toBeCloseTo(0.2);
    expect(prefs.weights.condition).toBeCloseTo(0.2);
    expect(prefs.weights.availability).toBeCloseTo(0.2);
  });

  it("cheapest template increases price weight", () => {
    const cheapest = svc.resolvePreferences({ preferenceProfile: "cheapest" });
    const balanced = svc.resolvePreferences({ preferenceProfile: "balanced" });
    expect(cheapest.weights.price).toBeGreaterThan(balanced.weights.price);
    expect(cheapest.weights.price).toBeGreaterThan(cheapest.weights.condition);
  });

  it("professional template increases reliability/condition/availability weights", () => {
    const professional = svc.resolvePreferences({
      preferenceProfile: "professional",
    });
    expect(professional.weights.reliability).toBeGreaterThan(
      professional.weights.price,
    );
    expect(professional.weights.condition).toBeGreaterThan(
      professional.weights.distance,
    );
    expect(professional.weights.availability).toBeGreaterThan(
      professional.weights.price,
    );
  });

  it("minimalEffort increases pickup penalty multiplier", () => {
    const minimalEffort = svc.resolvePreferences({
      preferenceProfile: "minimalEffort",
    });
    const balanced = svc.resolvePreferences({ preferenceProfile: "balanced" });
    expect(minimalEffort.penaltyWeights.pickup).toBeGreaterThan(
      balanced.penaltyWeights.pickup,
    );
  });

  it("missing preferenceSliders falls back to balanced sliders", () => {
    const prefs = svc.resolvePreferences({});
    expect(prefs.profile).toBe("balanced");
    expect(prefs.sliders).toEqual({
      price: 7,
      distance: 7,
      reliability: 7,
      condition: 7,
      availability: 7,
      pickupSimplicity: 7,
    });
  });

  it("rejects invalid slider values below 1 or above 10", () => {
    const base = {
      slots: [
        {
          slotKey: "slot-1",
          mode: "category",
          categoryId: "cat-1",
          quantity: 1,
        },
      ],
      dateRange: { startDate: "2026-06-01", endDate: "2026-06-03" },
      userLocation: { lat: 32.0853, lng: 34.7818 },
      budget: 1000,
    };

    expect(
      optimizerRequestSchema.safeParse({
        ...base,
        preferenceSliders: {
          price: 0,
          distance: 7,
          reliability: 7,
          condition: 7,
          availability: 7,
          pickupSimplicity: 7,
        },
      }).success,
    ).toBe(false);

    expect(
      optimizerRequestSchema.safeParse({
        ...base,
        preferenceSliders: {
          price: 7,
          distance: 7,
          reliability: 7,
          condition: 11,
          availability: 7,
          pickupSimplicity: 7,
        },
      }).success,
    ).toBe(false);
  });
});
