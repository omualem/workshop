import { AvailabilityService } from "./availability.service";

describe("AvailabilityService", () => {
  it("returns false when booked plus blocked quantity exceeds inventory", async () => {
    const service = new AvailabilityService({
      bookingItem: {
        findMany: jest.fn().mockResolvedValue([{ quantity: 1 }]),
      },
      listingAvailabilityBlock: {
        findMany: jest.fn().mockResolvedValue([{ quantity: 1 }]),
      },
      listing: {
        findUnique: jest.fn().mockResolvedValue({ inventoryCount: 2 }),
      },
    } as any);

    await expect(
      service.isListingAvailable("listing", 1, new Date("2026-05-01"), new Date("2026-05-03")),
    ).resolves.toBe(false);
  });
});
