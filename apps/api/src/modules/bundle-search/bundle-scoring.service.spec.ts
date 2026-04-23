import { BundleScoringService } from "./bundle-scoring.service";

describe("BundleScoringService", () => {
  const service = new BundleScoringService();
  const weights = {
    price: 0.2,
    reliability: 0.2,
    logistics: 0.2,
    availability: 0.2,
    quality: 0.2,
  };

  const input = {
    maxBudget: 900,
    deliveryPreferred: false,
  } as any;

  it("penalizes imbalanced bundles", () => {
    const cheapButPainful = service.scoreBundle(
      {
        items: [
          { listing: { deliverySupported: false }, reliabilityScore: 7, qualityScore: 7, availabilityFitScore: 8 } as any,
        ],
        totalPrice: 600,
        totalDistanceKm: 30,
        pickupPointsCount: 4,
        lendersCount: 4,
        exactAvailabilityFit: true,
        requestedItemsCount: 3,
      },
      [],
      input,
      weights,
    );

    const balanced = service.scoreBundle(
      {
        items: [
          { listing: { deliverySupported: true }, reliabilityScore: 8.5, qualityScore: 8.7, availabilityFitScore: 8.4 } as any,
        ],
        totalPrice: 780,
        totalDistanceKm: 8,
        pickupPointsCount: 2,
        lendersCount: 2,
        exactAvailabilityFit: true,
        requestedItemsCount: 3,
      },
      [],
      input,
      weights,
    );

    expect(balanced.finalScore).toBeGreaterThan(cheapButPainful.finalScore);
  });
});
