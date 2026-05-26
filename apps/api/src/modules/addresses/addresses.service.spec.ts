import { AddressesService } from "./addresses.service";

function buildService(overrides?: {
  geocode?: jest.Mock;
}) {
  const prisma = {
    street: {
      findUnique: jest.fn().mockResolvedValue({
        id: "street-1",
        cityId: "city-1",
        nameHe: "הרצל",
        city: { id: "city-1", nameHe: "תל אביב" },
      }),
    },
  };
  const geocoding = {
    geocodeAddress:
      overrides?.geocode ??
      jest.fn().mockResolvedValue({
        lat: 32.1,
        lng: 34.8,
        cached: false,
        provider: "test",
      }),
  };
  const service = new AddressesService(prisma as any, geocoding as any);
  return { service, prisma, geocoding };
}

describe("AddressesService.resolveListingAddress", () => {
  it("derives pickupAddressText/pickupLat/pickupLng from city/street/number", async () => {
    const { service } = buildService();

    const result = await service.resolveListingAddress({
      cityId: "city-1",
      streetId: "street-1",
      addressNumber: 12,
    });

    expect(result).toMatchObject({
      pickupAddressText: "רחוב הרצל 12, תל אביב",
      pickupLat: 32.1,
      pickupLng: 34.8,
    });
  });

  it("ignores manually supplied coordinates and always geocodes", async () => {
    const { service, geocoding } = buildService();

    // Old clients may still send pickupLat/pickupLng — they must be ignored.
    const result = await service.resolveListingAddress({
      cityId: "city-1",
      streetId: "street-1",
      addressNumber: 12,
      pickupLat: 999,
      pickupLng: 999,
    } as any);

    expect(geocoding.geocodeAddress).toHaveBeenCalledTimes(1);
    expect(result?.pickupLat).toBe(32.1);
    expect(result?.pickupLng).toBe(34.8);
  });

  it("regenerates derived fields when the address number changes on update", async () => {
    const { service } = buildService();

    const existing = {
      cityId: "city-1",
      streetId: "street-1",
      addressNumber: 5,
      pickupLat: 32.0 as any,
      pickupLng: 34.7 as any,
      pickupAddressText: "רחוב הרצל 5, תל אביב",
      city: "תל אביב",
    };

    const result = await service.resolveListingAddress(
      { addressNumber: 20 },
      existing,
    );

    expect(result?.pickupAddressText).toBe("רחוב הרצל 20, תל אביב");
  });

  it("rejects an invalid address number with a Hebrew validation error", async () => {
    const { service } = buildService();

    await expect(
      service.resolveListingAddress({
        cityId: "city-1",
        streetId: "street-1",
        addressNumber: 0,
      }),
    ).rejects.toThrow("מספר בית");
  });
});
