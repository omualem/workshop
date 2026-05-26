import { optimizerRequestBodySchema } from "./bundle-optimizer.types";
import { PreferenceMappingService } from "./preference-mapping.service";

describe("PreferenceMappingService", () => {
  const svc = new PreferenceMappingService();

  it("balanced sliders normalize over 4 core dimensions", () => {
    const prefs = svc.resolvePreferences({ preferenceProfile: "balanced" });
    expect(prefs.weights).toEqual({
      price: 0.25,
      distance: 0.25,
      reliability: 0.25,
      availability: 0.25,
    });
  });

  it("cheapest template increases price weight", () => {
    const cheapest = svc.resolvePreferences({ preferenceProfile: "cheapest" });
    const balanced = svc.resolvePreferences({ preferenceProfile: "balanced" });
    expect(cheapest.weights.price).toBeGreaterThan(balanced.weights.price);
    expect(cheapest.weights.price).toBeGreaterThan(cheapest.weights.reliability);
  });

  it("professional template increases reliability and availability weights", () => {
    const professional = svc.resolvePreferences({
      preferenceProfile: "professional",
    });
    expect(professional.weights.reliability).toBeGreaterThan(
      professional.weights.price,
    );
    expect(professional.weights.availability).toBeGreaterThan(
      professional.weights.distance,
    );
  });

  it("missing preferenceSliders falls back to balanced sliders", () => {
    const prefs = svc.resolvePreferences({});
    expect(prefs.profile).toBe("balanced");
    expect(prefs.sliders).toEqual({
      price: 7,
      distance: 7,
      reliability: 7,
      availability: 7,
      pickupSimplicity: 7,
    });
  });

  it("rejects the removed highQuality profile", () => {
    const base = requestBase();
    expect(
      optimizerRequestBodySchema.safeParse({
        ...base,
        preferenceProfile: "highQuality",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid slider values below 1 or above 10", () => {
    const base = requestBase();

    expect(
      optimizerRequestBodySchema.safeParse({
        ...base,
        preferenceSliders: {
          price: 0,
          distance: 7,
          reliability: 7,
          availability: 7,
          pickupSimplicity: 7,
        },
      }).success,
    ).toBe(false);

    expect(
      optimizerRequestBodySchema.safeParse({
        ...base,
        preferenceSliders: {
          price: 7,
          distance: 7,
          reliability: 7,
          availability: 11,
          pickupSimplicity: 7,
        },
      }).success,
    ).toBe(false);
  });
});

function requestBase() {
  return {
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
}
