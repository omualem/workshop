import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

export interface GeocodeInput {
  cityId: string;
  streetId: string;
  addressNumber: number;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  provider: "nominatim";
  formattedAddress?: string;
  cached: boolean;
  addressText: string;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "RentMatchLocalDev/1.0";
const MIN_INTERVAL_MS = 1000;

/**
 * Server-side geocoding for Israeli addresses via OpenStreetMap Nominatim.
 *
 * Why a process-wide queue + 1 rps gate: Nominatim's public usage policy
 * caps free-tier callers at ~1 req/sec. Cache hits skip the queue entirely.
 */
@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private lastCallAt = 0;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly prisma: PrismaService) {}

  async geocodeAddress(
    input: GeocodeInput & { cityName: string; streetName: string },
  ): Promise<GeocodeResult> {
    const { cityId, streetId, addressNumber, cityName, streetName } = input;
    const addressText = `${streetName} ${addressNumber}, ${cityName}`;

    if (!Number.isInteger(addressNumber) || addressNumber < 1) {
      throw new BadRequestException("מספר בית חייב להיות מספר שלם וחיובי.");
    }

    const cached = await this.prisma.addressGeocodeCache.findUnique({
      where: {
        cityId_streetId_addressNumber: { cityId, streetId, addressNumber },
      },
    });

    if (cached) {
      return {
        lat: cached.lat,
        lng: cached.lng,
        provider: "nominatim",
        formattedAddress: cached.addressText,
        cached: true,
        addressText: cached.addressText,
      };
    }

    const query = `${streetName} ${addressNumber}, ${cityName}, ישראל`;
    const fetched = await this.callNominatimThrottled(query);

    if (!fetched) {
      throw new BadRequestException(
        "לא נמצאו קואורדינטות עבור הכתובת שנבחרה",
      );
    }

    await this.prisma.addressGeocodeCache.upsert({
      where: {
        cityId_streetId_addressNumber: { cityId, streetId, addressNumber },
      },
      create: {
        cityId,
        streetId,
        addressNumber,
        addressText,
        lat: fetched.lat,
        lng: fetched.lng,
        provider: "nominatim",
        rawResponse: fetched.raw as object,
      },
      update: {
        addressText,
        lat: fetched.lat,
        lng: fetched.lng,
        provider: "nominatim",
        rawResponse: fetched.raw as object,
      },
    });

    return {
      lat: fetched.lat,
      lng: fetched.lng,
      provider: "nominatim",
      formattedAddress: fetched.displayName ?? addressText,
      cached: false,
      addressText,
    };
  }

  private callNominatimThrottled(query: string) {
    const next = this.queue.then(() => this.callNominatim(query));
    this.queue = next.catch(() => undefined);
    return next;
  }

  protected async callNominatim(query: string): Promise<{
    lat: number;
    lng: number;
    displayName?: string;
    raw: unknown;
  } | null> {
    const wait = MIN_INTERVAL_MS - (Date.now() - this.lastCallAt);
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
    this.lastCallAt = Date.now();

    const url = new URL(NOMINATIM_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("countrycodes", "il");

    try {
      const response = await fetch(url.toString(), {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        this.logger.warn(
          `Nominatim returned ${response.status} for "${query}"`,
        );
        return null;
      }

      const data = (await response.json()) as Array<{
        lat: string;
        lon: string;
        display_name?: string;
      }>;

      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      const first = data[0];
      const lat = Number.parseFloat(first.lat);
      const lng = Number.parseFloat(first.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
      }

      return { lat, lng, displayName: first.display_name, raw: first };
    } catch (error) {
      this.logger.warn(
        `Nominatim call failed for "${query}": ${(error as Error).message}`,
      );
      return null;
    }
  }
}
