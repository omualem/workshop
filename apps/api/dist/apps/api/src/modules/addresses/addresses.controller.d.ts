import { AddressesService } from "./addresses.service";
import { GeocodingService } from "./geocoding.service";
interface GeocodeRequestBody {
    cityId?: string;
    streetId?: string;
    addressNumber?: number;
}
export declare class AddressesController {
    private readonly addressesService;
    private readonly geocodingService;
    constructor(addressesService: AddressesService, geocodingService: GeocodingService);
    cities(q?: string, limit?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            settlementCode: number;
            nameHe: string;
        }[];
    }>;
    streets(cityId?: string, settlementCode?: string, q?: string, limit?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            streetCode: number;
            nameHe: string;
        }[];
    }>;
    geocode(body: GeocodeRequestBody): Promise<{
        success: boolean;
        data: {
            addressText: string;
            lat: number;
            lng: number;
            provider: string;
            cached: boolean;
        };
    }>;
}
export {};
