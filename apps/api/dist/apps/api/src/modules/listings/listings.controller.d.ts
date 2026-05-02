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
    findAll(query: ListingQueryDto): Promise<{
        items: ({
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
                listingId: string;
                sortOrder: number;
                url: string;
                altText: string;
            }[];
            attributeValues: {
                id: string;
                listingId: string;
                attributeKey: string;
                attributeValue: import("@prisma/client/runtime/library").JsonValue;
            }[];
            availabilityBlocks: {
                id: string;
                listingId: string;
                quantity: number;
                status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
                startDate: Date;
                endDate: Date;
                reason: string | null;
            }[];
        } & {
            id: string;
            lenderId: string;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            titleHe: string;
            titleEn: string;
            descriptionHe: string;
            descriptionEn: string;
            suitableFor: string | null;
            mainUses: string | null;
            condition: import(".prisma/client").$Enums.ListingCondition;
            basePriceDaily: import("@prisma/client/runtime/library").Decimal;
            qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
            pickupLat: import("@prisma/client/runtime/library").Decimal;
            pickupLng: import("@prisma/client/runtime/library").Decimal;
            pickupAddressText: string;
            city: string | null;
            pickupInstructions: string | null;
            deliverySupported: boolean;
            includedItems: import("@prisma/client/runtime/library").JsonValue | null;
            cancellationPolicy: string | null;
            returnTerms: string | null;
            requiresOperator: boolean;
            setupRequired: boolean;
            inventoryCount: number;
            minRentalDays: number;
            maxRentalDays: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    search(q?: string, limit?: string): Promise<{
        id: any;
        titleHe: any;
        titleEn: any;
        categoryId: any;
        category: {
            id: any;
            nameHe: any;
        } | null;
        basePriceDaily: any;
        condition: any;
        city: null;
        lenderName: any;
        thumbnail: any;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string;
        mainUses: string;
        category: {
            id: string;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: {
                fields: {
                    key: string;
                    type: string;
                    labelHe: string;
                    labelEn: string;
                }[];
            };
            parent: {
                id: string;
                slug: string;
                nameHe: string;
                nameEn: string;
            };
        };
        categoryBreadcrumb: {
            id: string;
            slug: string;
            nameHe: string;
            nameEn: string;
        }[];
        media: {
            id: string;
            url: string;
            sortOrder: number;
            altText: string;
        }[];
        basePriceDaily: number;
        depositAmount: number;
        minRentalDays: number;
        maxRentalDays: number;
        condition: string;
        deliverySupported: boolean;
        pickupAddressText: string;
        city: string;
        pickupInstructions: string;
        location: {
            city: string;
            area: string;
            pickupSummary: string;
            pickupAddressText: string;
            deliverySupported: boolean;
        };
        attributes: ({
            key: string;
            labelHe: string;
            labelEn: string;
            type: string;
            value: string;
        } | {
            key: string;
            labelHe: string;
            labelEn: string;
            type: string;
            value: boolean;
        })[];
        attributeValues: ({
            attributeKey: string;
            attributeValue: string;
        } | {
            attributeKey: string;
            attributeValue: boolean;
        })[];
        rentalTerms: {
            deposit: number;
            cancellationPolicy: string;
            returnTerms: string;
            requiresOperator: boolean;
            setupRequired: boolean;
        };
        includedItems: string[];
        lenderSummary: {
            id: string;
            displayName: string;
            rating: number;
            reliability: string;
            responseScore: number;
            completedTransactions: number;
        };
        lender: {
            userId: string;
            displayName: string;
            averageRating: number;
            completedTransactionsCount: number;
            responseTimeScore: number;
            reliabilityScoreCached: number;
            verificationLevel: string;
            user: {
                fullName: string;
                email: string;
            };
        };
        reviewSummary: {
            averageRating: number;
            count: number;
        };
        recentReviews: {
            id: string;
            rating: number;
            text: string;
            createdAt: string;
            reviewer: {
                fullName: string;
            };
        }[];
        reviews: never[];
    } | {
        categoryBreadcrumb: {
            id: string;
            slug: string;
            nameHe: string;
            nameEn: string;
        }[];
        attributes: {
            key: string;
            labelHe: string;
            labelEn: string;
            type: string;
            value: import("@prisma/client/runtime/library").JsonValue;
        }[];
        includedItems: string[];
        rentalTerms: {
            deposit: number;
            cancellationPolicy: string | null;
            returnTerms: string | null;
            requiresOperator: boolean;
            setupRequired: boolean;
        };
        location: {
            city: string | null;
            area: string | null;
            pickupSummary: string;
            pickupAddressText: string;
            lat: import("@prisma/client/runtime/library").Decimal;
            lng: import("@prisma/client/runtime/library").Decimal;
            deliverySupported: boolean;
        };
        availabilityBlocks: {
            id: string;
            startDate: Date;
            endDate: Date;
            status: string;
            quantity: number;
            reason: string | null;
        }[];
        lenderSummary: {
            id: string;
            displayName: string;
            rating: number;
            reliability: string;
            responseScore: number;
            completedTransactions: number;
        };
        reviewSummary: {
            averageRating: number | null;
            count: number;
        };
        recentReviews: {
            id: string;
            rating: number;
            text: string;
            createdAt: Date;
            reviewer: {
                fullName: string;
            };
        }[];
        id: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        minRentalDays: number;
        maxRentalDays: number;
        condition: string;
        deliverySupported: boolean;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        category: {
            id: string;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
            parent: {
                id: string;
                slug: string;
                nameHe: string;
                nameEn: string;
            } | null;
        };
        lender: {
            userId: string;
            displayName: string;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: string;
            user: {
                fullName: string;
                email: string;
            };
        };
        media: Array<{
            id: string;
            url: string;
            sortOrder: number;
            altText: string;
        }>;
        attributeValues: Array<{
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }>;
        reviews: Array<{
            id: string;
            rating: number;
            text: string;
            createdAt: Date;
            reviewer: {
                fullName: string;
            };
        }>;
    }>;
    availability(id: string, startDate: string, endDate: string): Promise<{
        available: boolean;
        reason: string | null;
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
            listingId: string;
            sortOrder: number;
            url: string;
            altText: string;
        }[];
    } & {
        id: string;
        lenderId: string;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ListingStatus;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        condition: import(".prisma/client").$Enums.ListingCondition;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: import("@prisma/client/runtime/library").JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
    })[]>;
    create(user: {
        sub: string;
    }, dto: CreateListingDto): Promise<{
        media: {
            id: string;
            listingId: string;
            sortOrder: number;
            url: string;
            altText: string;
        }[];
        attributeValues: {
            id: string;
            listingId: string;
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }[];
        availabilityBlocks: {
            id: string;
            listingId: string;
            quantity: number;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            startDate: Date;
            endDate: Date;
            reason: string | null;
        }[];
    } & {
        id: string;
        lenderId: string;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ListingStatus;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        condition: import(".prisma/client").$Enums.ListingCondition;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: import("@prisma/client/runtime/library").JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
    }>;
    update(user: {
        sub: string;
    }, id: string, dto: UpdateListingDto): Promise<{
        media: {
            id: string;
            listingId: string;
            sortOrder: number;
            url: string;
            altText: string;
        }[];
        attributeValues: {
            id: string;
            listingId: string;
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }[];
        availabilityBlocks: {
            id: string;
            listingId: string;
            quantity: number;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            startDate: Date;
            endDate: Date;
            reason: string | null;
        }[];
    } & {
        id: string;
        lenderId: string;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ListingStatus;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        condition: import(".prisma/client").$Enums.ListingCondition;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: import("@prisma/client/runtime/library").JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
    }>;
    addMedia(user: {
        sub: string;
    }, id: string, dto: AddMediaDto): Promise<{
        id: string;
        listingId: string;
        sortOrder: number;
        url: string;
        altText: string;
    }>;
    addAvailabilityBlock(user: {
        sub: string;
    }, id: string, dto: CreateAvailabilityBlockDto): Promise<{
        id: string;
        listingId: string;
        quantity: number;
        status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
        startDate: Date;
        endDate: Date;
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
            listingId: string;
            sortOrder: number;
            url: string;
            altText: string;
        }[];
        attributeValues: {
            id: string;
            listingId: string;
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }[];
        availabilityBlocks: {
            id: string;
            listingId: string;
            quantity: number;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            startDate: Date;
            endDate: Date;
            reason: string | null;
        }[];
    } & {
        id: string;
        lenderId: string;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ListingStatus;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        condition: import(".prisma/client").$Enums.ListingCondition;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: import("@prisma/client/runtime/library").JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
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
        media: {
            id: string;
            listingId: string;
            sortOrder: number;
            url: string;
            altText: string;
        }[];
        attributeValues: {
            id: string;
            listingId: string;
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }[];
        availabilityBlocks: {
            id: string;
            listingId: string;
            quantity: number;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            startDate: Date;
            endDate: Date;
            reason: string | null;
        }[];
    } & {
        id: string;
        lenderId: string;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ListingStatus;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        condition: import(".prisma/client").$Enums.ListingCondition;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: import("@prisma/client/runtime/library").JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
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
        media: {
            id: string;
            listingId: string;
            sortOrder: number;
            url: string;
            altText: string;
        }[];
        attributeValues: {
            id: string;
            listingId: string;
            attributeKey: string;
            attributeValue: import("@prisma/client/runtime/library").JsonValue;
        }[];
        availabilityBlocks: {
            id: string;
            listingId: string;
            quantity: number;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            startDate: Date;
            endDate: Date;
            reason: string | null;
        }[];
    } & {
        id: string;
        lenderId: string;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ListingStatus;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        condition: import(".prisma/client").$Enums.ListingCondition;
        basePriceDaily: import("@prisma/client/runtime/library").Decimal;
        qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
        pickupLat: import("@prisma/client/runtime/library").Decimal;
        pickupLng: import("@prisma/client/runtime/library").Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: import("@prisma/client/runtime/library").JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
    }>;
}
