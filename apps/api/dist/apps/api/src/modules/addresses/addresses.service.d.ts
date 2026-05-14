import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { GeocodingService } from "./geocoding.service";
export declare class AddressesService {
    private readonly prisma;
    private readonly geocoding;
    private readonly logger;
    constructor(prisma: PrismaService, geocoding: GeocodingService);
    searchCities(q?: string, limit?: number): Promise<{
        id: string;
        settlementCode: number;
        nameHe: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    searchStreets(params: {
        cityId?: string;
        settlementCode?: number;
        q?: string;
        limit?: number;
    }): Promise<{
        id: string;
        nameHe: string;
        createdAt: Date;
        updatedAt: Date;
        cityId: string;
        streetCode: number;
    }[]>;
    resolveListingAddress(input: {
        cityId?: string;
        streetId?: string;
        addressNumber?: number;
        pickupLat?: number;
        pickupLng?: number;
    }, existing?: {
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
    }): Promise<{
        cityId: string;
        streetId: string;
        addressNumber: number;
        cityName: string;
        streetName: string;
        pickupAddressText: string;
        pickupLat: number;
        pickupLng: number;
    } | undefined>;
    geocodeRenterAddress(input: {
        cityId: string;
        streetId: string;
        addressNumber: number;
    }): Promise<{
        lat: number;
        lng: number;
        addressText: string;
        cached: boolean;
        provider: string;
    }>;
    private fallbackCoordinatesForCity;
}
