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
const addresses_service_1 = require("../addresses/addresses.service");
const audit_service_1 = require("../audit/audit.service");
const availability_service_1 = require("../availability/availability.service");
let ListingsService = class ListingsService {
    prisma;
    auditService;
    availabilityService;
    addressesService;
    constructor(prisma, auditService, availabilityService, addressesService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.availabilityService = availabilityService;
        this.addressesService = addressesService;
    }
    async findAll(query) {
        const page = Math.max(1, parseInt(query.page ?? "1", 10));
        const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize ?? "12", 10)));
        const priceGte = query.minPrice !== undefined ? parseFloat(query.minPrice) : undefined;
        const priceLte = query.maxPrice !== undefined ? parseFloat(query.maxPrice) : undefined;
        const listings = await this.prisma.listing.findMany({
            where: {
                status: "ACTIVE",
                categoryId: query.categoryId ?? undefined,
                lenderId: query.lenderId ?? undefined,
                deliverySupported: query.deliverySupported !== undefined
                    ? query.deliverySupported === "true"
                    : undefined,
                basePriceDaily: priceGte !== undefined || priceLte !== undefined
                    ? { gte: priceGte, lte: priceLte }
                    : undefined,
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
                cityRef: true,
                streetRef: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
            },
            orderBy: [{ qualityScoreCached: "desc" }, { createdAt: "desc" }],
        });
        let filtered = listings;
        if (query.startDate && query.endDate) {
            const start = new Date(query.startDate);
            const end = new Date(query.endDate);
            const availableFlags = await Promise.all(listings.map((listing) => this.availabilityService.isListingAvailable(listing.id, 1, start, end, listing.inventoryCount)));
            filtered = listings.filter((_, i) => availableFlags[i]);
        }
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const skip = (page - 1) * pageSize;
        const items = filtered
            .slice(skip, skip + pageSize)
            .map((listing) => (0, prisma_utils_1.normalizeDecimalObject)(listing));
        return { items, total, page, pageSize, totalPages };
    }
    async searchActive(q, limit) {
        const safeLimit = Math.min(50, Math.max(1, Number.isFinite(limit) ? limit : 10));
        const term = (q ?? "").trim();
        const items = await this.prisma.listing.findMany({
            where: {
                status: "ACTIVE",
                ...(term
                    ? {
                        OR: [
                            { titleHe: { contains: term } },
                            { titleEn: { contains: term } },
                        ],
                    }
                    : {}),
            },
            include: {
                category: true,
                lender: { include: { user: true } },
                media: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
            orderBy: [{ qualityScoreCached: "desc" }, { createdAt: "desc" }],
            take: safeLimit,
        });
        return items.map((listing) => {
            const normalized = (0, prisma_utils_1.normalizeDecimalObject)(listing);
            return {
                id: normalized.id,
                titleHe: normalized.titleHe,
                titleEn: normalized.titleEn,
                categoryId: normalized.categoryId,
                category: normalized.category
                    ? { id: normalized.category.id, nameHe: normalized.category.nameHe }
                    : null,
                basePriceDaily: normalized.basePriceDaily,
                city: null,
                lenderName: normalized.lender?.displayName ?? normalized.lender?.user?.fullName ?? null,
                thumbnail: normalized.media?.[0]?.url ?? null,
            };
        });
    }
    async findOne(id) {
        if (id === "mock" && this.isLocalDevelopment()) {
            return this.mockListingDetail();
        }
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                category: {
                    include: {
                        parent: true,
                    },
                },
                lender: {
                    include: {
                        user: true,
                        deliveryWindows: true,
                    },
                },
                media: { orderBy: { sortOrder: "asc" } },
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
                cityRef: true,
                streetRef: true,
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
        return this.toListingDetailResponse(listing);
    }
    async create(lenderId, dto) {
        const data = await this.buildListingWriteData(dto, lenderId, "PENDING_REVIEW");
        const listing = await this.prisma.listing.create({
            data,
            include: {
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                cityRef: true,
                streetRef: true,
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
        const data = await this.buildListingUpdateData(dto, existing);
        const updated = await this.prisma.listing.update({
            where: { id },
            data,
            include: {
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                cityRef: true,
                streetRef: true,
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
                cityRef: true,
                streetRef: true,
            },
            orderBy: { updatedAt: "desc" },
        });
        return listings.map((listing) => (0, prisma_utils_1.normalizeDecimalObject)(listing));
    }
    async publicAvailability(id, startDate, endDate) {
        if (id === "mock" && this.isLocalDevelopment()) {
            return this.availabilityResponseForDates(startDate, endDate, true);
        }
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            select: { inventoryCount: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        const parsed = this.parseAvailabilityDates(startDate, endDate);
        if (!parsed) {
            return { available: false, reason: "invalid_date_range" };
        }
        const available = await this.availabilityService.isListingAvailable(id, 1, parsed.start, parsed.end, listing.inventoryCount);
        if (available) {
            return { available: true, reason: null };
        }
        return {
            available: false,
            reason: await this.availabilityService.getAvailabilityReason(id, parsed.start, parsed.end),
        };
    }
    async adminFindAll(query) {
        const listings = await this.prisma.listing.findMany({
            where: {
                categoryId: query.categoryId,
                lenderId: query.lenderId,
                status: query.status
                    ? query.status
                    : { not: "ARCHIVED" },
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
                cityRef: true,
                streetRef: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
            },
            orderBy: [{ updatedAt: "desc" }],
        });
        return listings.map((listing) => (0, prisma_utils_1.normalizeDecimalObject)(listing));
    }
    async adminCreate(dto, actorUserId) {
        const data = await this.buildListingWriteData(dto, dto.lenderId, dto.status ?? "ACTIVE");
        const listing = await this.prisma.listing.create({
            data,
            include: {
                category: true,
                cityRef: true,
                streetRef: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
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
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
                cityRef: true,
                streetRef: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        const data = await this.buildListingUpdateData(dto, existing);
        const updated = await this.prisma.listing.update({
            where: { id },
            data,
            include: {
                category: true,
                cityRef: true,
                streetRef: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
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
    async adminDelete(id, actorUserId) {
        const existing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        if (existing.status !== "ARCHIVED") {
            const archived = await this.prisma.listing.update({
                where: { id },
                data: { status: "ARCHIVED" },
            });
            await this.auditService.log({
                actorUserId,
                action: "admin.listing.delete",
                entityType: "Listing",
                entityId: id,
                before: existing,
                after: archived,
            });
        }
        return { id };
    }
    async adminDuplicate(id, actorUserId) {
        const existing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                media: { orderBy: { sortOrder: "asc" } },
                attributeValues: true,
                availabilityBlocks: { orderBy: { startDate: "asc" } },
                pricingRules: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        const duplicated = await this.prisma.listing.create({
            data: {
                lender: { connect: { userId: existing.lenderId } },
                category: { connect: { id: existing.categoryId } },
                cityRef: existing.cityId ? { connect: { id: existing.cityId } } : undefined,
                streetRef: existing.streetId
                    ? { connect: { id: existing.streetId } }
                    : undefined,
                addressNumber: existing.addressNumber,
                titleHe: `${existing.titleHe} (עותק)`,
                titleEn: `${existing.titleEn} (Copy)`,
                descriptionHe: existing.descriptionHe,
                descriptionEn: existing.descriptionEn,
                suitableFor: existing.suitableFor,
                mainUses: existing.mainUses,
                status: existing.status,
                basePriceDaily: existing.basePriceDaily,
                depositAmount: existing.depositAmount,
                qualityScoreCached: existing.qualityScoreCached,
                popularityScore: existing.popularityScore,
                manualPriorityBoost: existing.manualPriorityBoost,
                pickupLat: existing.pickupLat,
                pickupLng: existing.pickupLng,
                pickupAddressText: existing.pickupAddressText,
                city: existing.city,
                pickupInstructions: existing.pickupInstructions,
                deliverySupported: existing.deliverySupported,
                includedItems: existing.includedItems,
                cancellationPolicy: existing.cancellationPolicy,
                returnTerms: existing.returnTerms,
                requiresOperator: existing.requiresOperator,
                setupRequired: existing.setupRequired,
                inventoryCount: existing.inventoryCount,
                minRentalDays: existing.minRentalDays,
                maxRentalDays: existing.maxRentalDays,
                media: existing.media.length
                    ? {
                        create: existing.media.map((media) => ({
                            url: media.url,
                            sortOrder: media.sortOrder,
                            altText: media.altText,
                        })),
                    }
                    : undefined,
                attributeValues: existing.attributeValues.length
                    ? {
                        create: existing.attributeValues.map((attribute) => ({
                            attributeKey: attribute.attributeKey,
                            attributeValue: attribute.attributeValue,
                        })),
                    }
                    : undefined,
                availabilityBlocks: existing.availabilityBlocks.length
                    ? {
                        create: existing.availabilityBlocks.map((block) => ({
                            startDate: block.startDate,
                            endDate: block.endDate,
                            status: block.status,
                            quantity: block.quantity,
                            reason: block.reason,
                        })),
                    }
                    : undefined,
                pricingRules: existing.pricingRules.length
                    ? {
                        create: existing.pricingRules.map((rule) => ({
                            ruleType: rule.ruleType,
                            minDays: rule.minDays,
                            maxDays: rule.maxDays,
                            percentDiscount: rule.percentDiscount,
                            fixedOverride: rule.fixedOverride,
                            weekendAdjustment: rule.weekendAdjustment,
                            seasonalAdjustment: rule.seasonalAdjustment,
                            startsAt: rule.startsAt,
                            endsAt: rule.endsAt,
                            metadata: rule.metadata,
                        })),
                    }
                    : undefined,
            },
            include: {
                category: true,
                cityRef: true,
                streetRef: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
            },
        });
        await this.auditService.log({
            actorUserId,
            action: "admin.listing.duplicate",
            entityType: "Listing",
            entityId: duplicated.id,
            before: existing,
            after: duplicated,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(duplicated);
    }
    async adminChangeOwner(id, lenderId, actorUserId) {
        const existing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                category: true,
                cityRef: true,
                streetRef: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        const updated = await this.prisma.listing.update({
            where: { id },
            data: {
                lender: { connect: { userId: lenderId } },
            },
            include: {
                category: true,
                cityRef: true,
                streetRef: true,
                lender: {
                    include: {
                        user: true,
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
                attributeValues: true,
                availabilityBlocks: {
                    orderBy: { startDate: "asc" },
                },
            },
        });
        await this.auditService.log({
            actorUserId,
            action: "admin.listing.change-owner",
            entityType: "Listing",
            entityId: id,
            before: existing,
            after: updated,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(updated);
    }
    async buildListingWriteData(dto, lenderId, status) {
        this.assertRentalDayBounds(dto.minRentalDays, dto.maxRentalDays);
        const location = await this.resolvePickupLocation(dto);
        if (!location) {
            throw new common_1.BadRequestException("יש לבחור כתובת תקינה או לאמת כתובת");
        }
        return {
            lender: { connect: { userId: lenderId } },
            category: { connect: { id: dto.categoryId } },
            cityRef: { connect: { id: location.cityId } },
            streetRef: { connect: { id: location.streetId } },
            addressNumber: location.addressNumber,
            titleHe: dto.titleHe,
            titleEn: dto.titleEn,
            descriptionHe: dto.descriptionHe,
            descriptionEn: dto.descriptionEn,
            suitableFor: dto.suitableFor,
            mainUses: dto.mainUses,
            status,
            basePriceDaily: dto.basePriceDaily,
            depositAmount: dto.depositAmount,
            qualityScoreCached: 0,
            popularityScore: dto.popularityScore,
            manualPriorityBoost: dto.manualPriorityBoost,
            pickupLat: location.pickupLat,
            pickupLng: location.pickupLng,
            pickupAddressText: location.pickupAddressText,
            city: location.cityName,
            pickupInstructions: dto.pickupInstructions,
            deliverySupported: dto.deliverySupported,
            includedItems: dto.includedItems,
            cancellationPolicy: dto.cancellationPolicy,
            returnTerms: dto.returnTerms,
            requiresOperator: dto.requiresOperator ?? false,
            setupRequired: dto.setupRequired ?? false,
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
            media: "imageUrls" in dto && dto.imageUrls?.length
                ? {
                    create: dto.imageUrls.map((url, index) => ({
                        url,
                        sortOrder: index,
                        altText: dto.titleHe,
                    })),
                }
                : undefined,
            availabilityBlocks: dto.availabilityBlocks?.length
                ? {
                    create: dto.availabilityBlocks.map((block) => ({
                        startDate: new Date(block.startDate),
                        endDate: new Date(block.endDate),
                        status: block.status ?? "BLOCKED",
                        quantity: block.quantity ?? 1,
                        reason: block.reason,
                    })),
                }
                : undefined,
        };
    }
    async buildListingUpdateData(dto, existing) {
        this.assertRentalDayBounds(dto.minRentalDays ?? existing?.minRentalDays, dto.maxRentalDays ?? existing?.maxRentalDays);
        const location = await this.resolvePickupLocation(dto, existing);
        return {
            lender: "lenderId" in dto && dto.lenderId
                ? { connect: { userId: dto.lenderId } }
                : undefined,
            category: dto.categoryId
                ? { connect: { id: dto.categoryId } }
                : undefined,
            cityRef: location?.cityId
                ? { connect: { id: location.cityId } }
                : undefined,
            streetRef: location?.streetId
                ? { connect: { id: location.streetId } }
                : undefined,
            addressNumber: location?.addressNumber,
            titleHe: dto.titleHe,
            titleEn: dto.titleEn,
            descriptionHe: dto.descriptionHe,
            descriptionEn: dto.descriptionEn,
            suitableFor: dto.suitableFor,
            mainUses: dto.mainUses,
            status: "status" in dto ? dto.status : undefined,
            basePriceDaily: dto.basePriceDaily,
            depositAmount: dto.depositAmount,
            popularityScore: dto.popularityScore,
            manualPriorityBoost: dto.manualPriorityBoost,
            pickupLat: location?.pickupLat,
            pickupLng: location?.pickupLng,
            pickupAddressText: location?.pickupAddressText,
            city: location?.cityName,
            pickupInstructions: dto.pickupInstructions,
            deliverySupported: dto.deliverySupported,
            includedItems: dto.includedItems,
            cancellationPolicy: dto.cancellationPolicy,
            returnTerms: dto.returnTerms,
            requiresOperator: dto.requiresOperator,
            setupRequired: dto.setupRequired,
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
            media: "imageUrls" in dto && Array.isArray(dto.imageUrls)
                ? {
                    deleteMany: {},
                    create: dto.imageUrls.map((url, index) => ({
                        url,
                        sortOrder: index,
                        altText: dto.titleHe ?? "תמונת פריט",
                    })),
                }
                : undefined,
            availabilityBlocks: dto.availabilityBlocks
                ? {
                    deleteMany: {},
                    create: dto.availabilityBlocks.map((block) => ({
                        startDate: new Date(block.startDate),
                        endDate: new Date(block.endDate),
                        status: block.status ?? "BLOCKED",
                        quantity: block.quantity ?? 1,
                        reason: block.reason,
                    })),
                }
                : undefined,
        };
    }
    assertRentalDayBounds(minDays, maxDays) {
        if (minDays !== undefined && minDays < 1) {
            throw new common_1.BadRequestException("minRentalDays must be at least 1");
        }
        if (maxDays !== undefined && maxDays < 1) {
            throw new common_1.BadRequestException("maxRentalDays must be at least 1");
        }
        if (minDays !== undefined &&
            maxDays !== undefined &&
            maxDays < minDays) {
            throw new common_1.BadRequestException("maxRentalDays must be greater than or equal to minRentalDays");
        }
    }
    resolvePickupLocation(dto, existing) {
        return this.addressesService.resolveListingAddress({
            cityId: dto.cityId,
            streetId: dto.streetId,
            addressNumber: dto.addressNumber,
        }, existing);
    }
    async requireLenderOwnedListing(lenderId, listingId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { media: true, attributeValues: true, cityRef: true, streetRef: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException("Listing not found");
        }
        if (listing.lenderId !== lenderId) {
            throw new common_1.ForbiddenException("Listing does not belong to current lender");
        }
        return listing;
    }
    toListingDetailResponse(listing) {
        const normalized = (0, prisma_utils_1.normalizeDecimalObject)(listing);
        const ratingValues = listing.reviews.map((review) => review.rating);
        const averageReviewRating = ratingValues.length > 0
            ? Math.round((ratingValues.reduce((sum, rating) => sum + rating, 0) /
                ratingValues.length) *
                10) / 10
            : null;
        return {
            ...normalized,
            categoryBreadcrumb: this.categoryBreadcrumb(listing.category),
            attributes: this.attributesForResponse(listing.category.attributesSchema, listing.attributeValues),
            includedItems: this.arrayFromJson(listing.includedItems),
            rentalTerms: {
                deposit: Number(listing.depositAmount),
                cancellationPolicy: listing.cancellationPolicy,
                returnTerms: listing.returnTerms,
                requiresOperator: listing.requiresOperator,
                setupRequired: listing.setupRequired,
            },
            location: {
                city: listing.city,
                cityId: listing.cityId,
                streetId: listing.streetId,
                addressNumber: listing.addressNumber,
                street: listing.streetRef?.nameHe ?? null,
                area: listing.city,
                pickupSummary: listing.pickupInstructions ?? listing.pickupAddressText,
                pickupAddressText: listing.pickupAddressText,
                lat: normalized.pickupLat,
                lng: normalized.pickupLng,
                deliverySupported: listing.deliverySupported,
            },
            availabilityBlocks: normalized.availabilityBlocks ?? [],
            lenderSummary: {
                id: listing.lender.userId,
                displayName: listing.lender.displayName,
                rating: Number(listing.lender.averageRating),
                reliability: Number(listing.lender.reliabilityScoreCached) >= 8 ||
                    listing.lender.verificationLevel !== "BASIC"
                    ? "אמינות גבוהה"
                    : "אמינות בבדיקה",
                responseScore: Math.round(Number(listing.lender.responseTimeScore) * 20),
                completedTransactions: listing.lender.completedTransactionsCount,
            },
            reviewSummary: {
                averageRating: averageReviewRating,
                count: listing.reviews.length,
            },
            recentReviews: normalized.reviews,
        };
    }
    attributesForResponse(attributesSchema, values) {
        const fields = this.attributeSchemaFields(attributesSchema);
        const fieldByKey = new Map(fields.map((field) => [field.key, field]));
        return values.map((value) => {
            const field = fieldByKey.get(value.attributeKey);
            return {
                key: value.attributeKey,
                labelHe: field?.labelHe ?? value.attributeKey,
                labelEn: field?.labelEn ?? value.attributeKey,
                type: field?.type ?? typeof value.attributeValue,
                value: value.attributeValue,
            };
        });
    }
    attributeSchemaFields(attributesSchema) {
        if (!attributesSchema ||
            typeof attributesSchema !== "object" ||
            Array.isArray(attributesSchema)) {
            return [];
        }
        const fields = attributesSchema.fields;
        if (!Array.isArray(fields)) {
            return [];
        }
        return fields.filter(this.isAttributeField);
    }
    isAttributeField(field) {
        return (typeof field === "object" &&
            field !== null &&
            typeof field.key === "string" &&
            typeof field.labelHe === "string" &&
            typeof field.labelEn === "string" &&
            typeof field.type === "string");
    }
    categoryBreadcrumb(category) {
        return [
            ...(category.parent
                ? [
                    {
                        id: category.parent.id,
                        slug: category.parent.slug,
                        nameHe: category.parent.nameHe,
                        nameEn: category.parent.nameEn,
                    },
                ]
                : []),
            {
                id: category.id,
                slug: category.slug,
                nameHe: category.nameHe,
                nameEn: category.nameEn,
            },
        ];
    }
    arrayFromJson(value) {
        return Array.isArray(value)
            ? value.filter((item) => typeof item === "string")
            : [];
    }
    parseAvailabilityDates(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!startDate ||
            !endDate ||
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start >= end) {
            return null;
        }
        return { start, end };
    }
    availabilityResponseForDates(startDate, endDate, available) {
        const parsed = this.parseAvailabilityDates(startDate, endDate);
        if (!parsed) {
            return { available: false, reason: "invalid_date_range" };
        }
        return { available, reason: available ? null : "blocked" };
    }
    isLocalDevelopment() {
        return process.env.NODE_ENV !== "production";
    }
    mockListingDetail() {
        return {
            id: "mock",
            titleHe: "רמקול מוגבר JBL לאירועים",
            titleEn: "JBL Powered Event Speaker",
            descriptionHe: "רמקול מוגבר איכותי שמתאים לאירועים קטנים ובינוניים, הרצאות, מסיבות וימי הולדת.",
            descriptionEn: "A quality powered speaker for small and mid-size events, talks, parties and birthdays.",
            suitableFor: "אירועים פרטיים, הרצאות, מסיבות קטנות, ימי הולדת",
            mainUses: "השמעת מוזיקה, הגברה לדיבור, קריוקי בסיסי",
            category: {
                id: "mock-speakers",
                slug: "speakers",
                nameHe: "רמקולים",
                nameEn: "Speakers",
                attributesSchema: {
                    fields: [
                        {
                            key: "powerWatts",
                            type: "string",
                            labelHe: "הספק",
                            labelEn: "Power",
                        },
                        {
                            key: "bluetooth",
                            type: "boolean",
                            labelHe: "Bluetooth",
                            labelEn: "Bluetooth",
                        },
                        {
                            key: "batteryPowered",
                            type: "boolean",
                            labelHe: "מופעל סוללה",
                            labelEn: "Battery Powered",
                        },
                        {
                            key: "inputPorts",
                            type: "string",
                            labelHe: "כניסות",
                            labelEn: "Input Ports",
                        },
                    ],
                },
                parent: {
                    id: "mock-sound",
                    slug: "sound",
                    nameHe: "סאונד",
                    nameEn: "Sound",
                },
            },
            categoryBreadcrumb: [
                { id: "mock-sound", slug: "sound", nameHe: "סאונד", nameEn: "Sound" },
                {
                    id: "mock-speakers",
                    slug: "speakers",
                    nameHe: "רמקולים",
                    nameEn: "Speakers",
                },
            ],
            media: [
                {
                    id: "mock-image-1",
                    url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1400&q=80",
                    sortOrder: 0,
                    altText: "רמקול מוגבר JBL לאירועים",
                },
                {
                    id: "mock-image-2",
                    url: "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&w=900&q=80",
                    sortOrder: 1,
                    altText: "ציוד סאונד לאירוע",
                },
            ],
            basePriceDaily: 180,
            depositAmount: 500,
            minRentalDays: 1,
            maxRentalDays: 7,
            deliverySupported: true,
            pickupAddressText: "צפון תל אביב",
            city: "תל אביב",
            pickupInstructions: "איסוף מצפון תל אביב, אפשרות משלוח בתיאום מראש",
            location: {
                city: "תל אביב",
                area: "תל אביב",
                pickupSummary: "איסוף מצפון תל אביב, אפשרות משלוח בתיאום מראש",
                pickupAddressText: "צפון תל אביב",
                deliverySupported: true,
            },
            attributes: [
                {
                    key: "powerWatts",
                    labelHe: "הספק",
                    labelEn: "Power",
                    type: "string",
                    value: "1000W",
                },
                {
                    key: "bluetooth",
                    labelHe: "Bluetooth",
                    labelEn: "Bluetooth",
                    type: "boolean",
                    value: true,
                },
                {
                    key: "batteryPowered",
                    labelHe: "מופעל סוללה",
                    labelEn: "Battery Powered",
                    type: "boolean",
                    value: false,
                },
                {
                    key: "inputPorts",
                    labelHe: "כניסות",
                    labelEn: "Input Ports",
                    type: "string",
                    value: "XLR, AUX, USB",
                },
            ],
            attributeValues: [
                { attributeKey: "powerWatts", attributeValue: "1000W" },
                { attributeKey: "bluetooth", attributeValue: true },
                { attributeKey: "batteryPowered", attributeValue: false },
                { attributeKey: "inputPorts", attributeValue: "XLR, AUX, USB" },
            ],
            rentalTerms: {
                deposit: 500,
                cancellationPolicy: "ביטול עד 24 שעות לפני מועד ההשכרה ללא חיוב",
                returnTerms: "יש להחזיר את המוצר במצב תקין ובאריזה המקורית אם קיימת",
                requiresOperator: false,
                setupRequired: false,
            },
            includedItems: ["רמקול מוגבר JBL", "סטנד לרמקול", "כבל חשמל", "כבל AUX"],
            lenderSummary: {
                id: "mock-lender",
                displayName: "EventPro Rentals",
                rating: 4.8,
                reliability: "אמינות גבוהה",
                responseScore: 96,
                completedTransactions: 124,
            },
            lender: {
                userId: "mock-lender",
                displayName: "EventPro Rentals",
                averageRating: 4.8,
                completedTransactionsCount: 124,
                responseTimeScore: 4.8,
                reliabilityScoreCached: 9.2,
                verificationLevel: "VERIFIED",
                user: { fullName: "EventPro Rentals", email: "mock@example.local" },
            },
            reviewSummary: {
                averageRating: 4.8,
                count: 3,
            },
            recentReviews: [
                {
                    id: "mock-review-1",
                    rating: 5,
                    text: "הרמקול היה חזק וברור, והאיסוף היה מהיר ומסודר.",
                    createdAt: "2026-04-12T10:00:00.000Z",
                    reviewer: { fullName: "דנה כהן" },
                },
                {
                    id: "mock-review-2",
                    rating: 5,
                    text: "התאים מצוין להרצאה של 60 משתתפים. קיבלנו גם כבלים וסטנד.",
                    createdAt: "2026-04-04T10:00:00.000Z",
                    reviewer: { fullName: "יואב לוי" },
                },
                {
                    id: "mock-review-3",
                    rating: 4,
                    text: "שירות טוב ומוצר במצב מעולה. המשלוח דרש תיאום מראש.",
                    createdAt: "2026-03-27T10:00:00.000Z",
                    reviewer: { fullName: "מיכל אברהם" },
                },
            ],
            reviews: [],
        };
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        availability_service_1.AvailabilityService,
        addresses_service_1.AddressesService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map