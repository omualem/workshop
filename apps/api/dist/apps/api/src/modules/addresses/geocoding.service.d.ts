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
export declare class GeocodingService {
    private readonly prisma;
    private readonly logger;
    private lastCallAt;
    private queue;
    constructor(prisma: PrismaService);
    geocodeAddress(input: GeocodeInput & {
        cityName: string;
        streetName: string;
    }): Promise<GeocodeResult>;
    private callNominatimThrottled;
    protected callNominatim(query: string): Promise<{
        lat: number;
        lng: number;
        displayName?: string;
        raw: unknown;
    } | null>;
}
