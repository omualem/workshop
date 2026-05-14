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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../shared/decorators/public.decorator");
const addresses_service_1 = require("./addresses.service");
const geocoding_service_1 = require("./geocoding.service");
const address_normalization_1 = require("./address-normalization");
let AddressesController = class AddressesController {
    addressesService;
    geocodingService;
    constructor(addressesService, geocodingService) {
        this.addressesService = addressesService;
        this.geocodingService = geocodingService;
    }
    async cities(q, limit) {
        const data = await this.addressesService.searchCities(q, limit ? Number.parseInt(limit, 10) : 20);
        return {
            success: true,
            data: data.map((city) => ({
                id: city.id,
                settlementCode: city.settlementCode,
                nameHe: city.nameHe,
            })),
        };
    }
    async streets(cityId, settlementCode, q, limit) {
        const data = await this.addressesService.searchStreets({
            cityId,
            settlementCode: settlementCode
                ? Number.parseInt(settlementCode, 10)
                : undefined,
            q,
            limit: limit ? Number.parseInt(limit, 10) : 20,
        });
        return {
            success: true,
            data: data.map((street) => ({
                id: street.id,
                streetCode: street.streetCode,
                nameHe: street.nameHe,
            })),
        };
    }
    async geocode(body) {
        if (!body?.cityId ||
            !body?.streetId ||
            body.addressNumber === undefined ||
            body.addressNumber === null) {
            throw new common_1.BadRequestException("יש לבחור עיר, רחוב ומספר בית תקינים.");
        }
        const addressNumber = Number(body.addressNumber);
        const result = await this.addressesService.geocodeRenterAddress({
            cityId: body.cityId,
            streetId: body.streetId,
            addressNumber,
        });
        return {
            success: true,
            data: {
                addressText: (0, address_normalization_1.normalizeHebrewAddressText)(result.addressText),
                lat: result.lat,
                lng: result.lng,
                provider: result.provider,
                cached: result.cached,
            },
        };
    }
};
exports.AddressesController = AddressesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("cities"),
    __param(0, (0, common_1.Query)("q")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "cities", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("streets"),
    __param(0, (0, common_1.Query)("cityId")),
    __param(1, (0, common_1.Query)("settlementCode")),
    __param(2, (0, common_1.Query)("q")),
    __param(3, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "streets", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("geocode"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "geocode", null);
exports.AddressesController = AddressesController = __decorate([
    (0, common_1.Controller)("addresses"),
    __metadata("design:paramtypes", [addresses_service_1.AddressesService,
        geocoding_service_1.GeocodingService])
], AddressesController);
//# sourceMappingURL=addresses.controller.js.map