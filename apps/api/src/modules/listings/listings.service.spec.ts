import { ListingsService } from "./listings.service";

const baseCreateDto = {
  categoryId: "cat-1",
  cityId: "city-1",
  streetId: "street-1",
  addressNumber: 12,
  titleHe: "כיסא",
  titleEn: "Chair",
  descriptionHe: "תיאור ארוך מספיק",
  descriptionEn: "Long enough description",
  basePriceDaily: 100,
  depositAmount: 0,
  deliverySupported: false,
  inventoryCount: 1,
  minRentalDays: 1,
  maxRentalDays: 10,
};

const derivedLocation = {
  cityId: "city-1",
  streetId: "street-1",
  addressNumber: 12,
  cityName: "תל אביב",
  streetName: "הרצל",
  pickupAddressText: "רחוב הרצל 12, תל אביב",
  pickupLat: 32.1,
  pickupLng: 34.8,
};

function buildService() {
  const prisma = {
    listing: {
      create: jest.fn().mockResolvedValue({ id: "listing-1" }),
      update: jest.fn().mockResolvedValue({ id: "listing-1" }),
      findUnique: jest.fn(),
    },
  };
  const audit = { log: jest.fn().mockResolvedValue(undefined) };
  const availability = {};
  const addresses = {
    resolveListingAddress: jest.fn().mockResolvedValue(derivedLocation),
  };
  const service = new ListingsService(
    prisma as any,
    audit as any,
    availability as any,
    addresses as any,
  );
  return { service, prisma, addresses };
}

describe("ListingsService address derivation", () => {
  it("derives pickupAddressText/pickupLat/pickupLng/city on create", async () => {
    const { service, prisma } = buildService();

    await service.create("lender-1", baseCreateDto as any);

    const data = prisma.listing.create.mock.calls[0][0].data;
    expect(data.pickupAddressText).toBe("רחוב הרצל 12, תל אביב");
    expect(data.pickupLat).toBe(32.1);
    expect(data.pickupLng).toBe(34.8);
    expect(data.city).toBe("תל אביב");
  });

  it("does not forward manually supplied coordinates to address resolution", async () => {
    const { service, addresses } = buildService();

    await service.create("lender-1", {
      ...baseCreateDto,
      pickupLat: 999,
      pickupLng: 999,
      pickupAddressText: "כתובת מזויפת",
    } as any);

    expect(addresses.resolveListingAddress).toHaveBeenCalledWith(
      { cityId: "city-1", streetId: "street-1", addressNumber: 12 },
      undefined,
    );
  });

  it("regenerates derived fields when the address changes on update", async () => {
    const { service, prisma, addresses } = buildService();

    prisma.listing.findUnique.mockResolvedValue({
      id: "listing-1",
      lenderId: "lender-1",
      cityId: "city-1",
      streetId: "street-1",
      addressNumber: 5,
      pickupLat: 32.0,
      pickupLng: 34.7,
      pickupAddressText: "רחוב הרצל 5, תל אביב",
      city: "תל אביב",
      minRentalDays: 1,
      maxRentalDays: 10,
      media: [],
      attributeValues: [],
      cityRef: null,
      streetRef: null,
    });
    addresses.resolveListingAddress.mockResolvedValue({
      ...derivedLocation,
      addressNumber: 20,
      pickupAddressText: "רחוב הרצל 20, תל אביב",
      pickupLat: 32.2,
      pickupLng: 34.9,
    });

    await service.update("lender-1", "listing-1", {
      addressNumber: 20,
    } as any);

    const data = prisma.listing.update.mock.calls[0][0].data;
    expect(data.pickupAddressText).toBe("רחוב הרצל 20, תל אביב");
    expect(data.pickupLat).toBe(32.2);
    expect(data.pickupLng).toBe(34.9);
  });
});
