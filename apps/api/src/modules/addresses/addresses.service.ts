import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { decimalToNumber } from "../../shared/utils/prisma.utils";
import {
  normalizeAddressSearchTerm,
  normalizeHebrewAddressText,
} from "./address-normalization";
import { GeocodingService } from "./geocoding.service";

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geocoding: GeocodingService,
  ) {}

  async searchCities(q?: string, limit = 20) {
    const term = normalizeAddressSearchTerm(q ?? "");
    const safeLimit = Math.min(50, Math.max(1, limit));
    return this.prisma.city.findMany({
      where: term ? { nameHe: { contains: term } } : undefined,
      orderBy: [{ nameHe: "asc" }],
      take: safeLimit,
    });
  }

  async searchStreets(params: {
    cityId?: string;
    settlementCode?: number;
    q?: string;
    limit?: number;
  }) {
    const safeLimit = Math.min(50, Math.max(1, params.limit ?? 20));
    let cityId = params.cityId;

    if (!cityId && params.settlementCode !== undefined) {
      const city = await this.prisma.city.findUnique({
        where: { settlementCode: params.settlementCode },
        select: { id: true },
      });
      cityId = city?.id;
    }

    if (!cityId) {
      throw new BadRequestException("cityId או settlementCode נדרשים לחיפוש רחובות.");
    }

    const term = normalizeAddressSearchTerm(params.q ?? "");
    return this.prisma.street.findMany({
      where: {
        cityId,
        ...(term ? { nameHe: { contains: term } } : {}),
      },
      orderBy: [{ nameHe: "asc" }],
      take: safeLimit,
    });
  }

  /**
   * cityId + streetId + addressNumber are the source of truth for a listing
   * address. pickupAddressText / pickupLat / pickupLng are DERIVED here and
   * are never read from the input — any coordinates supplied by a caller are
   * ignored. Coordinates are always (re)generated via geocoding.
   */
  async resolveListingAddress(
    input: {
      cityId?: string;
      streetId?: string;
      addressNumber?: number;
    },
    existing?: {
      cityId: string | null;
      streetId: string | null;
      addressNumber: number | null;
      pickupLat: Prisma.Decimal;
      pickupLng: Prisma.Decimal;
      pickupAddressText: string;
      city: string | null;
    },
  ) {
    const nextCityId = input.cityId ?? existing?.cityId ?? null;
    const nextStreetId = input.streetId ?? existing?.streetId ?? null;
    const nextAddressNumber =
      input.addressNumber ?? existing?.addressNumber ?? null;
    const hasAddressSelectionInput =
      input.cityId !== undefined ||
      input.streetId !== undefined ||
      input.addressNumber !== undefined;

    if (!hasAddressSelectionInput && existing) {
      return undefined;
    }

    if (!nextCityId || !nextStreetId || nextAddressNumber === null) {
      throw new BadRequestException("יש לבחור עיר, רחוב ומספר בית תקינים.");
    }

    if (!Number.isInteger(nextAddressNumber) || nextAddressNumber < 1) {
      throw new BadRequestException("מספר בית חייב להיות מספר שלם וחיובי.");
    }

    const street = await this.prisma.street.findUnique({
      where: { id: nextStreetId },
      include: { city: true },
    });

    if (!street || street.cityId !== nextCityId) {
      throw new BadRequestException("הרחוב שנבחר אינו שייך לעיר שנבחרה.");
    }

    const cityName = normalizeHebrewAddressText(street.city.nameHe);
    const streetName = normalizeHebrewAddressText(street.nameHe);
    const pickupAddressText = `רחוב ${streetName} ${nextAddressNumber}, ${cityName}`;

    try {
      const geocoded = await this.geocoding.geocodeAddress({
        cityId: street.city.id,
        streetId: street.id,
        addressNumber: nextAddressNumber,
        cityName,
        streetName,
      });
      return {
        cityId: street.city.id,
        streetId: street.id,
        addressNumber: nextAddressNumber,
        cityName,
        streetName,
        pickupAddressText,
        pickupLat: geocoded.lat,
        pickupLng: geocoded.lng,
      };
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        throw new BadRequestException("לא ניתן לאמת את כתובת האיסוף");
      }
      this.logger.warn(
        `Geocoding failed for "${pickupAddressText}", falling back to city coordinates: ${
          (error as Error).message
        }`,
      );
      const fallback = this.fallbackCoordinatesForCity(
        cityName,
        existing
          ? {
              lat: decimalToNumber(existing.pickupLat) ?? 32.0853,
              lng: decimalToNumber(existing.pickupLng) ?? 34.7818,
            }
          : undefined,
      );

      return {
        cityId: street.city.id,
        streetId: street.id,
        addressNumber: nextAddressNumber,
        cityName,
        streetName,
        pickupAddressText,
        pickupLat: fallback.lat,
        pickupLng: fallback.lng,
      };
    }
  }

  /**
   * Resolve a renter-provided address (city/street/number) to coordinates,
   * used by the bundle optimizer. Throws a Hebrew-friendly error if the
   * address is invalid or geocoding cannot resolve it.
   */
  async geocodeRenterAddress(input: {
    cityId: string;
    streetId: string;
    addressNumber: number;
  }) {
    if (!input.cityId || !input.streetId) {
      throw new BadRequestException("יש לבחור עיר, רחוב ומספר בית תקינים.");
    }
    if (!Number.isInteger(input.addressNumber) || input.addressNumber < 1) {
      throw new BadRequestException("מספר בית חייב להיות מספר שלם וחיובי.");
    }

    const street = await this.prisma.street.findUnique({
      where: { id: input.streetId },
      include: { city: true },
    });
    if (!street || street.cityId !== input.cityId) {
      throw new BadRequestException("הרחוב שנבחר אינו שייך לעיר שנבחרה.");
    }

    const cityName = normalizeHebrewAddressText(street.city.nameHe);
    const streetName = normalizeHebrewAddressText(street.nameHe);
    const addressText = `${streetName} ${input.addressNumber}, ${cityName}`;

    try {
      const result = await this.geocoding.geocodeAddress({
        cityId: input.cityId,
        streetId: input.streetId,
        addressNumber: input.addressNumber,
        cityName,
        streetName,
      });
      return {
        lat: result.lat,
        lng: result.lng,
        addressText,
        cached: result.cached,
        provider: result.provider,
      };
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        throw new BadRequestException(
          "לא ניתן לחשב מיקום עבור כתובת השוכר",
        );
      }
      this.logger.warn(
        `Renter geocoding failed for "${addressText}", falling back to city coordinates: ${
          (error as Error).message
        }`,
      );
      const fallback = this.fallbackCoordinatesForCity(cityName);
      return {
        lat: fallback.lat,
        lng: fallback.lng,
        addressText,
        cached: false,
        provider: "fallback",
      };
    }
  }

  private fallbackCoordinatesForCity(
    rawValue: string,
    fallback?: { lat: number; lng: number },
  ) {
    const normalized = normalizeAddressSearchTerm(rawValue)
      .toLowerCase()
      .replace(/[\s-]/g, "");
    const cityMap: Record<string, { lat: number; lng: number }> = {
      "תל אביב": { lat: 32.0853, lng: 34.7818 },
      תלאביב: { lat: 32.0853, lng: 34.7818 },
      תלאביביפו: { lat: 32.0853, lng: 34.7818 },
      ירושלים: { lat: 31.7683, lng: 35.2137 },
      חיפה: { lat: 32.794, lng: 34.9896 },
      בארשבע: { lat: 31.252, lng: 34.7915 },
      ראשוןלציון: { lat: 31.973, lng: 34.7925 },
      פתחתקווה: { lat: 32.084, lng: 34.8878 },
      נתניה: { lat: 32.3215, lng: 34.8532 },
      אשדוד: { lat: 31.8014, lng: 34.6435 },
    };

    if (cityMap[normalized]) {
      return cityMap[normalized];
    }

    if (fallback) {
      return fallback;
    }

    // TODO: Replace this temporary city fallback with real geocoding.
    return { lat: 32.0853, lng: 34.7818 };
  }
}
