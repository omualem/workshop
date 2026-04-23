import { BundleGenerationService } from "./bundle-generation.service";

describe("BundleGenerationService", () => {
  it("prunes candidates to safe bounds while keeping cheapest option", async () => {
    const service = new BundleGenerationService(
      {
        listing: {
          findMany: jest.fn().mockResolvedValue(
            Array.from({ length: 8 }).map((_, index) => ({
              id: `listing-${index}`,
              lenderId: `lender-${index}`,
              categoryId: "11111111-1111-4111-8111-111111111112",
              titleHe: "x",
              titleEn: "x",
              descriptionHe: "x".repeat(120),
              descriptionEn: "x".repeat(120),
              condition: "GOOD",
              status: "ACTIVE",
              basePriceDaily: 100 + index,
              depositAmount: 200,
              qualityScoreCached: 8,
              pickupLat: 32.08,
              pickupLng: 34.78,
              pickupAddressText: "TLV",
              deliverySupported: true,
              inventoryCount: 1,
              minRentalDays: 1,
              maxRentalDays: 7,
              createdAt: new Date(),
              updatedAt: new Date(),
              lender: {
                averageRating: 4.5,
                completedTransactionsCount: 40,
                cancellationRate: 2,
                lateReturnRate: 1,
                complaintRate: 0,
                verificationLevel: "VERIFIED",
                responseTimeScore: 8,
              },
              media: [{ id: `media-${index}` }],
              attributeValues: [],
              pricingRules: [],
              reviews: [{ rating: 5 }],
            })),
          ),
        },
      } as any,
      {
        isListingAvailable: jest.fn().mockResolvedValue(true),
        availabilityFragilityScore: jest.fn().mockResolvedValue(8),
      } as any,
      {
        computeListingPrice: jest.fn((listing) => ({ total: Number(listing.basePriceDaily), perDay: Number(listing.basePriceDaily), days: 1 })),
      } as any,
      {
        compute: jest.fn().mockReturnValue(8),
      } as any,
    );

    const { result } = await service.findCandidatesPerSlot({
      requestedItems: [
        {
          slotKey: "camera",
          categoryId: "11111111-1111-4111-8111-111111111112",
          quantity: 1,
          optional: false,
          constraints: {},
        },
      ],
      dateRange: {
        startDate: new Date("2026-05-01").toISOString(),
        endDate: new Date("2026-05-03").toISOString(),
      },
      renterLocation: {
        lat: 32.08,
        lng: 34.78,
        addressText: "Tel Aviv",
      },
      preferenceProfile: "balanced",
      sameLenderPreferred: false,
      deliveryPreferred: false,
      exactDatesOnly: true,
    } as any);

    expect(result.camera.length).toBeLessThanOrEqual(6);
    expect(result.camera.some((candidate) => candidate.estimatedPrice === 100)).toBe(true);
  });
});
