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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const audit_service_1 = require("../audit/audit.service");
const availability_service_1 = require("../availability/availability.service");
let ListingsService = class ListingsService {
    prisma;
    auditService;
    availabilityService;
    constructor(prisma, auditService, availabilityService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.availabilityService = availabilityService;
    }
    async findAll(query) {
        const listings = await this.prisma.listing.findMany({
            where: {
                status: "ACTIVE",
                categoryId: query.categoryId,
                lenderId: query.lenderId,
                deliverySupported: query.deliverySupported !== undefined ? query.deliverySupported === "true" : undefined,
                OR: query.search
                    ? [
                        { titleHe: { contains: query.search } },
                        { titleEn: { contains: query.search } },
                        { descriptionHe: { contains: query.search } },
                        { descriptionEn: { contains: query.search } },
                    ]
                    : undefined,
            },
            include: {
                category: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
            },
            orderBy: [{ qualityScoreCached: "desc" }, { createdAt: "desc" }],
        });
        return listings.map((listing) => (0, prisma_utils_1.normalizeDecimalObject)(listing));
    }
    async findOne(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                category: true,
                lender: {
                    include: {
                        user: true,
                        deliveryWindows: true,
                    },
                },
                media: { orderBy: { sortOrder: "asc" } },
                attributeValues: true,
                pricingRules: true,
                reviews: {
                    include: {
                        reviewer: {
                            select: { fullName: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 8,
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        return (0, prisma_utils_1.normalizeDecimalObject)({
            ...listing,
            completenessHints: this.computeListingCompletenessHints(listing),
        });
    }
    async create(lenderId, dto) {
        const listing = await this.prisma.listing.create({
            data: this.buildListingWriteData(dto, lenderId, "PENDING_REVIEW"),
            include: {
                attributeValues: true,
            },
        });
        await this.auditService.log({
            actorUserId: lenderId,
            action: "listing.create",
            entityType: "Listing",
            entityId: listing.id,
            after: listing,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(listing);
    }
    async update(lenderId, id, dto) {
        const existing = await this.requireLenderOwnedListing(lenderId, id);
        const updated = await this.prisma.listing.update({
            where: { id },
            data: this.buildListingUpdateData(dto),
            include: {
                attributeValues: true,
            },
        });
        await this.auditService.log({
            actorUserId: lenderId,
            action: "listing.update",
            entityType: "Listing",
            entityId: id,
            before: existing,
            after: updated,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(updated);
    }
    async addMedia(lenderId, id, dto) {
        await this.requireLenderOwnedListing(lenderId, id);
        return this.prisma.listingMedia.create({
            data: {
                listingId: id,
                ...dto,
            },
        });
    }
    async addAvailabilityBlock(lenderId, id, dto) {
        await this.requireLenderOwnedListing(lenderId, id);
        return this.prisma.listingAvailabilityBlock.create({
            data: {
                listingId: id,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                status: dto.status,
                quantity: dto.quantity,
                reason: dto.reason,
            },
        });
    }
    async addPricingRule(lenderId, id, dto) {
        await this.requireLenderOwnedListing(lenderId, id);
        const rule = await this.prisma.pricingRule.create({
            data: {
                listingId: id,
                ruleType: dto.ruleType,
                minDays: dto.minDays,
                maxDays: dto.maxDays,
                percentDiscount: dto.percentDiscount,
                fixedOverride: dto.fixedOverride,
                weekendAdjustment: dto.weekendAdjustment,
                seasonalAdjustment: dto.seasonalAdjustment,
                startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
                endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
            },
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(rule);
    }
    async lenderListings(lenderId) {
        const listings = await this.prisma.listing.findMany({
            where: { lenderId },
            include: {
                media: true,
                category: true,
            },
            orderBy: { updatedAt: "desc" },
        });
        return listings.map((listing) => (0, prisma_utils_1.normalizeDecimalObject)(listing));
    }
    async publicAvailability(id, startDate, endDate) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            select: { inventoryCount: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        const available = await this.availabilityService.isListingAvailable(id, 1, new Date(startDate), new Date(endDate), listing.inventoryCount);
        return { available };
    }
    async adminFindAll(query) {
        const listings = await this.prisma.listing.findMany({
            where: {
                categoryId: query.categoryId,
                lenderId: query.lenderId,
                status: query.status,
                OR: query.search
                    ? [
                        { titleHe: { contains: query.search } },
                        { titleEn: { contains: query.search } },
                        { descriptionHe: { contains: query.search } },
                        { descriptionEn: { contains: query.search } },
                    ]
                    : undefined,
            },
            include: {
                category: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
            },
            orderBy: [{ updatedAt: "desc" }],
        });
        return listings.map((listing) => (0, prisma_utils_1.normalizeDecimalObject)(listing));
    }
    async adminCreate(dto, actorUserId) {
        const listing = await this.prisma.listing.create({
            data: this.buildListingWriteData(dto, dto.lenderId, dto.status ?? "ACTIVE"),
            include: {
                category: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        await this.auditService.log({
            actorUserId,
            action: "admin.listing.create",
            entityType: "Listing",
            entityId: listing.id,
            after: listing,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(listing);
    }
    async adminUpdate(id, dto, actorUserId) {
        const existing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                attributeValues: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        const updated = await this.prisma.listing.update({
            where: { id },
            data: this.buildListingUpdateData(dto),
            include: {
                category: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        await this.auditService.log({
            actorUserId,
            action: "admin.listing.update",
            entityType: "Listing",
            entityId: updated.id,
            before: existing,
            after: updated,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(updated);
    }
    buildListingWriteData(dto, lenderId, status) {
        return {
            lenderId,
            categoryId: dto.categoryId,
            titleHe: dto.titleHe,
            titleEn: dto.titleEn,
            descriptionHe: dto.descriptionHe,
            descriptionEn: dto.descriptionEn,
            condition: dto.condition,
            status,
            basePriceDaily: dto.basePriceDaily,
            depositAmount: dto.depositAmount,
            qualityScoreCached: 0,
            pickupLat: dto.pickupLat,
            pickupLng: dto.pickupLng,
            pickupAddressText: dto.pickupAddressText,
            deliverySupported: dto.deliverySupported,
            inventoryCount: dto.inventoryCount,
            minRentalDays: dto.minRentalDays,
            maxRentalDays: dto.maxRentalDays,
            attributeValues: dto.attributeValues?.length
                ? {
                    create: dto.attributeValues.map((entry) => ({
                        attributeKey: entry.attributeKey,
                        attributeValue: entry.attributeValue,
                    })),
                }
                : undefined,
        };
    }
    buildListingUpdateData(dto) {
        return {
            lenderId: "lenderId" in dto ? dto.lenderId : undefined,
            categoryId: dto.categoryId,
            titleHe: dto.titleHe,
            titleEn: dto.titleEn,
            descriptionHe: dto.descriptionHe,
            descriptionEn: dto.descriptionEn,
            condition: dto.condition,
            status: "status" in dto ? dto.status : undefined,
            basePriceDaily: dto.basePriceDaily,
            depositAmount: dto.depositAmount,
            pickupLat: dto.pickupLat,
            pickupLng: dto.pickupLng,
            pickupAddressText: dto.pickupAddressText,
            deliverySupported: dto.deliverySupported,
            inventoryCount: dto.inventoryCount,
            minRentalDays: dto.minRentalDays,
            maxRentalDays: dto.maxRentalDays,
            attributeValues: dto.attributeValues
                ? {
                    deleteMany: {},
                    create: dto.attributeValues.map((entry) => ({
                        attributeKey: entry.attributeKey,
                        attributeValue: entry.attributeValue,
                    })),
                }
                : undefined,
        };
    }
    async requireLenderOwnedListing(lenderId, listingId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { media: true, attributeValues: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        if (listing.lenderId !== lenderId) {
            throw new common_1.ForbiddenException("Listing does not belong to current lender");
        }
        return listing;
    }
    computeListingCompletenessHints(listing) {
        const hints = [];
        if (listing.media.length < 3) {
            hints.push("הוספת תמונות נוספות תשפר את הדירוג");
        }
        if (listing.descriptionHe.length < 80 || listing.descriptionEn.length < 80) {
            hints.push("תיאור מפורט יותר יחזק את ציון האיכות");
        }
        if (listing.attributeValues.length < 3) {
            hints.push("מומלץ למלא מאפיינים טכניים נוספים");
        }
        return hints;
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        availability_service_1.AvailabilityService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map