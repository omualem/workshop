"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeocodingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "RentMatchLocalDev/1.0";
const MIN_INTERVAL_MS = 1000;
let GeocodingService = GeocodingService_1 = class GeocodingService {
    prisma;
    logger = new common_1.Logger(GeocodingService_1.name);
    lastCallAt = 0;
    queue = Promise.resolve();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async geocodeAddress(input) {
        const { cityId, streetId, addressNumber, cityName, streetName } = input;
        const addressText = `${streetName} ${addressNumber}, ${cityName}`;
        if (!Number.isInteger(addressNumber) || addressNumber < 1) {
            throw new common_1.BadRequestException("מספר בית חייב להיות מספר שלם וחיובי.");
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
            throw new common_1.BadRequestException("לא נמצאו קואורדינטות עבור הכתובת שנבחרה");
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
                rawResponse: fetched.raw,
            },
            update: {
                addressText,
                lat: fetched.lat,
                lng: fetched.lng,
                provider: "nominatim",
                rawResponse: fetched.raw,
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
    callNominatimThrottled(query) {
        const next = this.queue.then(() => this.callNominatim(query));
        this.queue = next.catch(() => undefined);
        return next;
    }
    async callNominatim(query) {
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
                this.logger.warn(`Nominatim returned ${response.status} for "${query}"`);
                return null;
            }
            const data = (await response.json());
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
        }
        catch (error) {
            this.logger.warn(`Nominatim call failed for "${query}": ${error.message}`);
            return null;
        }
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = GeocodingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map