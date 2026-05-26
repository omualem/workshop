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
var AddressesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const address_normalization_1 = require("./address-normalization");
const geocoding_service_1 = require("./geocoding.service");
let AddressesService = AddressesService_1 = class AddressesService {
    prisma;
    geocoding;
    logger = new common_1.Logger(AddressesService_1.name);
    constructor(prisma, geocoding) {
        this.prisma = prisma;
        this.geocoding = geocoding;
    }
    async searchCities(q, limit = 20) {
        const term = (0, address_normalization_1.normalizeAddressSearchTerm)(q ?? "");
        const safeLimit = Math.min(50, Math.max(1, limit));
        return this.prisma.city.findMany({
            where: term ? { nameHe: { contains: term } } : undefined,
            orderBy: [{ nameHe: "asc" }],
            take: safeLimit,
        });
    }
    async searchStreets(params) {
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
            throw new common_1.BadRequestException("cityId או settlementCode נדרשים לחיפוש רחובות.");
        }
        const term = (0, address_normalization_1.normalizeAddressSearchTerm)(params.q ?? "");
        return this.prisma.street.findMany({
            where: {
                cityId,
                ...(term ? { nameHe: { contains: term } } : {}),
            },
            orderBy: [{ nameHe: "asc" }],
            take: safeLimit,
        });
    }
    async resolveListingAddress(input, existing) {
        const nextCityId = input.cityId ?? existing?.cityId ?? null;
        const nextStreetId = input.streetId ?? existing?.streetId ?? null;
        const nextAddressNumber = input.addressNumber ?? existing?.addressNumber ?? null;
        const hasAddressSelectionInput = input.cityId !== undefined ||
            input.streetId !== undefined ||
            input.addressNumber !== undefined;
        if (!hasAddressSelectionInput && existing) {
            return undefined;
        }
        if (!nextCityId || !nextStreetId || nextAddressNumber === null) {
            throw new common_1.BadRequestException("יש לבחור עיר, רחוב ומספר בית תקינים.");
        }
        if (!Number.isInteger(nextAddressNumber) || nextAddressNumber < 1) {
            throw new common_1.BadRequestException("מספר בית חייב להיות מספר שלם וחיובי.");
        }
        const street = await this.prisma.street.findUnique({
            where: { id: nextStreetId },
            include: { city: true },
        });
        if (!street || street.cityId !== nextCityId) {
            throw new common_1.BadRequestException("הרחוב שנבחר אינו שייך לעיר שנבחרה.");
        }
        const cityName = (0, address_normalization_1.normalizeHebrewAddressText)(street.city.nameHe);
        const streetName = (0, address_normalization_1.normalizeHebrewAddressText)(street.nameHe);
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
        }
        catch (error) {
            if (process.env.NODE_ENV === "production") {
                throw new common_1.BadRequestException("לא ניתן לאמת את כתובת האיסוף");
            }
            this.logger.warn(`Geocoding failed for "${pickupAddressText}", falling back to city coordinates: ${error.message}`);
            const fallback = this.fallbackCoordinatesForCity(cityName, existing
                ? {
                    lat: (0, prisma_utils_1.decimalToNumber)(existing.pickupLat) ?? 32.0853,
                    lng: (0, prisma_utils_1.decimalToNumber)(existing.pickupLng) ?? 34.7818,
                }
                : undefined);
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
    async geocodeRenterAddress(input) {
        if (!input.cityId || !input.streetId) {
            throw new common_1.BadRequestException("יש לבחור עיר, רחוב ומספר בית תקינים.");
        }
        if (!Number.isInteger(input.addressNumber) || input.addressNumber < 1) {
            throw new common_1.BadRequestException("מספר בית חייב להיות מספר שלם וחיובי.");
        }
        const street = await this.prisma.street.findUnique({
            where: { id: input.streetId },
            include: { city: true },
        });
        if (!street || street.cityId !== input.cityId) {
            throw new common_1.BadRequestException("הרחוב שנבחר אינו שייך לעיר שנבחרה.");
        }
        const cityName = (0, address_normalization_1.normalizeHebrewAddressText)(street.city.nameHe);
        const streetName = (0, address_normalization_1.normalizeHebrewAddressText)(street.nameHe);
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
        }
        catch (error) {
            if (process.env.NODE_ENV === "production") {
                throw new common_1.BadRequestException("לא ניתן לחשב מיקום עבור כתובת השוכר");
            }
            this.logger.warn(`Renter geocoding failed for "${addressText}", falling back to city coordinates: ${error.message}`);
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
    fallbackCoordinatesForCity(rawValue, fallback) {
        const normalized = (0, address_normalization_1.normalizeAddressSearchTerm)(rawValue)
            .toLowerCase()
            .replace(/[\s-]/g, "");
        const cityMap = {
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
        return { lat: 32.0853, lng: 34.7818 };
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = AddressesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        geocoding_service_1.GeocodingService])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map