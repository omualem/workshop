import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { normalizeDecimalObject } from "../../shared/utils/prisma.utils";
import { AuditService } from "../audit/audit.service";
import { AvailabilityService } from "../availability/availability.service";
import { AddMediaDto } from "./dto/add-media.dto";
import { AdminCreateListingDto } from "./dto/admin-create-listing.dto";
import { AdminListingQueryDto } from "./dto/admin-listing-query.dto";
import { AdminUpdateListingDto } from "./dto/admin-update-listing.dto";
import { CreateAvailabilityBlockDto } from "./dto/create-availability-block.dto";
import { CreateListingDto } from "./dto/create-listing.dto";
import { CreatePricingRuleDto } from "./dto/create-pricing-rule.dto";
import { ListingQueryDto } from "./dto/listing-query.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async findAll(query: ListingQueryDto) {
    const page = Math.max(1, parseInt(query.page ?? "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize ?? "12", 10)));

    const priceGte = query.minPrice !== undefined ? parseFloat(query.minPrice) : undefined;
    const priceLte = query.maxPrice !== undefined ? parseFloat(query.maxPrice) : undefined;

    const listings = await this.prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        categoryId: query.categoryId ?? undefined,
        lenderId: query.lenderId ?? undefined,
        deliverySupported:
          query.deliverySupported !== undefined ? query.deliverySupported === "true" : undefined,
        basePriceDaily:
          priceGte !== undefined || priceLte !== undefined
            ? ({ gte: priceGte, lte: priceLte } as any)
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

    let filtered = listings;

    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);
      const availableFlags = await Promise.all(
        listings.map((listing) =>
          this.availabilityService.isListingAvailable(
            listing.id,
            1,
            start,
            end,
            listing.inventoryCount,
          ),
        ),
      );
      filtered = listings.filter((_, i) => availableFlags[i]);
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const skip = (page - 1) * pageSize;
    const items = filtered
      .slice(skip, skip + pageSize)
      .map((listing) => normalizeDecimalObject(listing));

    return { items, total, page, pageSize, totalPages };
  }

  async findOne(id: string) {
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
      throw new NotFoundException("Listing not found");
    }

    return normalizeDecimalObject({
      ...listing,
      completenessHints: this.computeListingCompletenessHints(listing),
    });
  }

  async create(lenderId: string, dto: CreateListingDto) {
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

    return normalizeDecimalObject(listing);
  }

  async update(lenderId: string, id: string, dto: UpdateListingDto) {
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

    return normalizeDecimalObject(updated);
  }

  async addMedia(lenderId: string, id: string, dto: AddMediaDto) {
    await this.requireLenderOwnedListing(lenderId, id);
    return this.prisma.listingMedia.create({
      data: {
        listingId: id,
        ...dto,
      },
    });
  }

  async addAvailabilityBlock(lenderId: string, id: string, dto: CreateAvailabilityBlockDto) {
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

  async addPricingRule(lenderId: string, id: string, dto: CreatePricingRuleDto) {
    await this.requireLenderOwnedListing(lenderId, id);
    const rule = await this.prisma.pricingRule.create({
      data: {
        listingId: id,
        ruleType: dto.ruleType as any,
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

    return normalizeDecimalObject(rule);
  }

  async lenderListings(lenderId: string) {
    const listings = await this.prisma.listing.findMany({
      where: { lenderId },
      include: {
        media: true,
        category: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return listings.map((listing: (typeof listings)[number]) => normalizeDecimalObject(listing));
  }

  async publicAvailability(id: string, startDate: string, endDate: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      select: { inventoryCount: true },
    });

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    const available = await this.availabilityService.isListingAvailable(
      id,
      1,
      new Date(startDate),
      new Date(endDate),
      listing.inventoryCount,
    );

    return { available };
  }

  async adminFindAll(query: AdminListingQueryDto) {
    const listings = await this.prisma.listing.findMany({
      where: {
        categoryId: query.categoryId,
        lenderId: query.lenderId,
        status: query.status as any,
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

    return listings.map((listing: (typeof listings)[number]) => normalizeDecimalObject(listing));
  }

  async adminCreate(dto: AdminCreateListingDto, actorUserId?: string) {
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

    return normalizeDecimalObject(listing);
  }

  async adminUpdate(id: string, dto: AdminUpdateListingDto, actorUserId?: string) {
    const existing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        attributeValues: true,
      },
    });

    if (!existing) {
      throw new NotFoundException("Listing not found");
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

    return normalizeDecimalObject(updated);
  }

  private buildListingWriteData(
    dto: CreateListingDto | AdminCreateListingDto,
    lenderId: string,
    status: "DRAFT" | "PENDING_REVIEW" | "ACTIVE" | "BLOCKED" | "ARCHIVED",
  ) {
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
              attributeValue: entry.attributeValue as Prisma.InputJsonValue,
            })),
          }
        : undefined,
    };
  }

  private buildListingUpdateData(dto: UpdateListingDto | AdminUpdateListingDto) {
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
              attributeValue: entry.attributeValue as Prisma.InputJsonValue,
            })),
          }
        : undefined,
    };
  }

  private async requireLenderOwnedListing(lenderId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { media: true, attributeValues: true },
    });

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    if (listing.lenderId !== lenderId) {
      throw new ForbiddenException("Listing does not belong to current lender");
    }

    return listing;
  }

  private computeListingCompletenessHints(listing: {
    media: unknown[];
    descriptionHe: string;
    descriptionEn: string;
    attributeValues: unknown[];
  }) {
    const hints: string[] = [];

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
}
