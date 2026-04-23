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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
let PricingService = class PricingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateRentalDays(startDate, endDate) {
        const diffMs = endDate.getTime() - startDate.getTime();
        return Math.max(1, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
    }
    async calculateListingPrice(listingId, startDate, endDate, quantity = 1) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { pricingRules: true },
        });
        if (!listing) {
            return null;
        }
        return this.computeListingPrice(listing, startDate, endDate, quantity);
    }
    computeListingPrice(listing, startDate, endDate, quantity = 1) {
        const days = this.calculateRentalDays(startDate, endDate);
        let baseTotal = (0, prisma_utils_1.decimalToNumber)(listing.basePriceDaily) * days * quantity;
        for (const rule of listing.pricingRules) {
            const withinDuration = (!rule.minDays || days >= rule.minDays) && (!rule.maxDays || days <= rule.maxDays);
            if (!withinDuration) {
                continue;
            }
            if (rule.ruleType === "FIXED_OVERRIDE" && rule.fixedOverride) {
                baseTotal = (0, prisma_utils_1.decimalToNumber)(rule.fixedOverride) * days * quantity;
            }
            if (rule.percentDiscount) {
                baseTotal *= 1 - (0, prisma_utils_1.decimalToNumber)(rule.percentDiscount) / 100;
            }
            if (rule.weekendAdjustment) {
                baseTotal *= 1 + (0, prisma_utils_1.decimalToNumber)(rule.weekendAdjustment) / 100;
            }
            if (rule.seasonalAdjustment) {
                baseTotal *= 1 + (0, prisma_utils_1.decimalToNumber)(rule.seasonalAdjustment) / 100;
            }
        }
        return {
            days,
            total: Number(baseTotal.toFixed(2)),
            perDay: Number((baseTotal / days).toFixed(2)),
        };
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map