import { AddMediaDto } from "./dto/add-media.dto";
import { AdminCreateListingDto } from "./dto/admin-create-listing.dto";
import { AdminListingQueryDto } from "./dto/admin-listing-query.dto";
import { AdminUpdateListingDto } from "./dto/admin-update-listing.dto";
import { CreateAvailabilityBlockDto } from "./dto/create-availability-block.dto";
import { CreateListingDto } from "./dto/create-listing.dto";
import { CreatePricingRuleDto } from "./dto/create-pricing-rule.dto";
import { ListingQueryDto } from "./dto/listing-query.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { ListingsService } from "./listings.service";
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    findAll(query: ListingQueryDto): Promise<({
        lender: {
            user: {
                id: string;
                status: import(".prisma/client").$Enums.UserStatus;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                fullName: string;
                email: string;
                phone: string;
                passwordHash: string;
                locale: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            isFeatured: boolean;
            pickupAreaGeo: import("@prisma/client/runtime/library").JsonValue | null;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
        };
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        };
        media: {
            id: string;
            sortOrder: number;
            listingId: string;
            url: string;
            altText: string;
        }[];
    } & {
        id: string;
        lenderId: string;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        condition: import(".prisma/client").$Enums.ListingCondition;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        deliverySupported: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        completenessHints: string[];
        lender: {
            user: {
                id: string;
                status: import(".prisma/client").$Enums.UserStatus;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                fullName: string;
                email: string;
                phone: string;
                passwordHash: string;
                locale: string;
            };
            deliveryWindows: {
                id: string;
                lenderId: string;
                title: string;
                dayOfWeek: number;
                startTime: string;
                endTime: string;
                zoneName: string;
                feeBase: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
            }[];
        } & {
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            isFeatured: boolean;
            pickupAreaGeo: import("@prisma/client/runtime/library").JsonValue | null;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
        };
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        };
        media: {
            id: string;
            sortOrder: number;
            listingId: string;
            url: string;
            altText: string;
        }[];
        attributeValues: {
            id: string;
            listingId: string;
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }[];
        pricingRules: {
            id: string;
            listingId: string;
            ruleType: import(".prisma/client").$Enums.PricingRuleType;
            minDays: number | null;
            maxDays: number | null;
            percentDiscount: import("@prisma/client/runtime/library").Decimal | null;
            fixedOverride: import("@prisma/client/runtime/library").Decimal | null;
            weekendAdjustment: import("@prisma/client/runtime/library").Decimal | null;
            seasonalAdjustment: import("@prisma/client/runtime/library").Decimal | null;
            startsAt: Date | null;
            endsAt: Date | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        reviews: ({
            reviewer: {
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            listingId: string | null;
            bookingId: string;
            reviewerId: string;
            revieweeUserId: string;
            rating: number;
            text: string;
            tags: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        id: string;
        lenderId: string;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        condition: import(".prisma/client").$Enums.ListingCondition;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        deliverySupported: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    availability(id: string, startDate: string, endDate: string): Promise<{
        available: boolean;
    }>;
    lenderListings(user: {
        sub: string;
    }): Promise<({
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        };
        media: {
            id: string;
            sortOrder: number;
            listingId: string;
            url: string;
            altText: string;
        }[];
    } & {
        id: string;
        lenderId: string;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        condition: import(".prisma/client").$Enums.ListingCondition;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        deliverySupported: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(user: {
        sub: string;
    }, dto: CreateListingDto): Promise<{
        attributeValues: {
            id: string;
            listingId: string;
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }[];
    } & {
        id: string;
        lenderId: string;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        condition: import(".prisma/client").$Enums.ListingCondition;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        deliverySupported: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(user: {
        sub: string;
    }, id: string, dto: UpdateListingDto): Promise<{
        attributeValues: {
            id: string;
            listingId: string;
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }[];
    } & {
        id: string;
        lenderId: string;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        condition: import(".prisma/client").$Enums.ListingCondition;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        deliverySupported: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMedia(user: {
        sub: string;
    }, id: string, dto: AddMediaDto): Promise<{
        id: string;
        sortOrder: number;
        listingId: string;
        url: string;
        altText: string;
    }>;
    addAvailabilityBlock(user: {
        sub: string;
    }, id: string, dto: CreateAvailabilityBlockDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
        listingId: string;
        startDate: Date;
        endDate: Date;
        quantity: number;
        reason: string | null;
    }>;
    addPricingRule(user: {
        sub: string;
    }, id: string, dto: CreatePricingRuleDto): Promise<{
        id: string;
        listingId: string;
        ruleType: import(".prisma/client").$Enums.PricingRuleType;
        minDays: number | null;
        maxDays: number | null;
        percentDiscount: import("@prisma/client/runtime/library").Decimal | null;
        fixedOverride: import("@prisma/client/runtime/library").Decimal | null;
        weekendAdjustment: import("@prisma/client/runtime/library").Decimal | null;
        seasonalAdjustment: import("@prisma/client/runtime/library").Decimal | null;
        startsAt: Date | null;
        endsAt: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    adminFindAll(query: AdminListingQueryDto): Promise<({
        lender: {
            user: {
                id: string;
                status: import(".prisma/client").$Enums.UserStatus;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                fullName: string;
                email: string;
                phone: string;
                passwordHash: string;
                locale: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            isFeatured: boolean;
            pickupAreaGeo: import("@prisma/client/runtime/library").JsonValue | null;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
        };
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        };
        media: {
            id: string;
            sortOrder: number;
            listingId: string;
            url: string;
            altText: string;
        }[];
    } & {
        id: string;
        lenderId: string;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        condition: import(".prisma/client").$Enums.ListingCondition;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        deliverySupported: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    adminCreate(dto: AdminCreateListingDto, user: {
        sub: string;
    }): Promise<{
        lender: {
            user: {
                id: string;
                status: import(".prisma/client").$Enums.UserStatus;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                fullName: string;
                email: string;
                phone: string;
                passwordHash: string;
                locale: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            isFeatured: boolean;
            pickupAreaGeo: import("@prisma/client/runtime/library").JsonValue | null;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
        };
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: string;
        lenderId: string;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        condition: import(".prisma/client").$Enums.ListingCondition;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        deliverySupported: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminUpdate(id: string, dto: AdminUpdateListingDto, user: {
        sub: string;
    }): Promise<{
        lender: {
            user: {
                id: string;
                status: import(".prisma/client").$Enums.UserStatus;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                fullName: string;
                email: string;
                phone: string;
                passwordHash: string;
                locale: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            isFeatured: boolean;
            pickupAreaGeo: import("@prisma/client/runtime/library").JsonValue | null;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
        };
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: string;
        lenderId: string;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        condition: import(".prisma/client").$Enums.ListingCondition;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        deliverySupported: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
