import { BadRequestException } from "@nestjs/common";
import { GeocodingService } from "./geocoding.service";

class TestableGeocodingService extends GeocodingService {
  public callMock = jest.fn();

  protected async callNominatim(query: string) {
    return this.callMock(query);
  }
}

function buildPrisma(initial?: {
  cityId: string;
  streetId: string;
  addressNumber: number;
  lat: number;
  lng: number;
  addressText: string;
}) {
  const cache = new Map<string, any>();
  if (initial) {
    cache.set(
      `${initial.cityId}|${initial.streetId}|${initial.addressNumber}`,
      {
        cityId: initial.cityId,
        streetId: initial.streetId,
        addressNumber: initial.addressNumber,
        lat: initial.lat,
        lng: initial.lng,
        addressText: initial.addressText,
        provider: "nominatim",
      },
    );
  }
  return {
    addressGeocodeCache: {
      findUnique: jest.fn(({ where }) => {
        const k = where.cityId_streetId_addressNumber;
        return Promise.resolve(
          cache.get(`${k.cityId}|${k.streetId}|${k.addressNumber}`) ?? null,
        );
      }),
      upsert: jest.fn(({ where, create }) => {
        const k = where.cityId_streetId_addressNumber;
        cache.set(`${k.cityId}|${k.streetId}|${k.addressNumber}`, create);
        return Promise.resolve(create);
      }),
    },
  } as any;
}

describe("GeocodingService", () => {
  it("returns cached coordinates without calling Nominatim", async () => {
    const prisma = buildPrisma({
      cityId: "c1",
      streetId: "s1",
      addressNumber: 12,
      lat: 32.1,
      lng: 34.8,
      addressText: "הרצל 12, תל אביב",
    });
    const svc = new TestableGeocodingService(prisma);

    const result = await svc.geocodeAddress({
      cityId: "c1",
      streetId: "s1",
      addressNumber: 12,
      cityName: "תל אביב",
      streetName: "הרצל",
    });

    expect(result.cached).toBe(true);
    expect(result.lat).toBe(32.1);
    expect(svc.callMock).not.toHaveBeenCalled();
    expect(prisma.addressGeocodeCache.upsert).not.toHaveBeenCalled();
  });

  it("calls Nominatim on cache miss and persists the result", async () => {
    const prisma = buildPrisma();
    const svc = new TestableGeocodingService(prisma);
    svc.callMock.mockResolvedValue({
      lat: 31.78,
      lng: 35.21,
      displayName: "King David 5, Jerusalem",
      raw: { lat: "31.78", lon: "35.21" },
    });

    const result = await svc.geocodeAddress({
      cityId: "c2",
      streetId: "s2",
      addressNumber: 5,
      cityName: "ירושלים",
      streetName: "המלך דוד",
    });

    expect(svc.callMock).toHaveBeenCalledTimes(1);
    expect(svc.callMock.mock.calls[0][0]).toContain("ישראל");
    expect(result.cached).toBe(false);
    expect(result.lat).toBe(31.78);
    expect(prisma.addressGeocodeCache.upsert).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid address numbers with a Hebrew error", async () => {
    const prisma = buildPrisma();
    const svc = new TestableGeocodingService(prisma);

    await expect(
      svc.geocodeAddress({
        cityId: "c",
        streetId: "s",
        addressNumber: 0,
        cityName: "X",
        streetName: "Y",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("throws Hebrew error when Nominatim returns no result", async () => {
    const prisma = buildPrisma();
    const svc = new TestableGeocodingService(prisma);
    svc.callMock.mockResolvedValue(null);

    await expect(
      svc.geocodeAddress({
        cityId: "c3",
        streetId: "s3",
        addressNumber: 7,
        cityName: "X",
        streetName: "Y",
      }),
    ).rejects.toThrow("לא נמצאו קואורדינטות עבור הכתובת שנבחרה");
  });
});
