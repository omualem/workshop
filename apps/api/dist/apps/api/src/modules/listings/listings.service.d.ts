import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AddressesService } from "../addresses/addresses.service";
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
export declare class ListingsService {
    private readonly prisma;
    private readonly auditService;
    private readonly availabilityService;
    private readonly addressesService;
    constructor(prisma: PrismaService, auditService: AuditService, availabilityService: AvailabilityService, addressesService: AddressesService);
    findAll(query: ListingQueryDto): Promise<{
        items: ({
            category: {
                id: string;
                status: import(".prisma/client").$Enums.CategoryStatus;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                slug: string;
                nameHe: string;
                nameEn: string;
                attributesSchema: Prisma.JsonValue | null;
            };
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
                averageRating: Prisma.Decimal;
                completedTransactionsCount: number;
                cancellationRate: Prisma.Decimal;
                lateReturnRate: Prisma.Decimal;
                complaintRate: Prisma.Decimal;
                verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
                responseTimeScore: Prisma.Decimal;
                isFeatured: boolean;
                pickupAreaGeo: Prisma.JsonValue | null;
                reliabilityScoreCached: Prisma.Decimal;
            };
            cityRef: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nameHe: string;
                settlementCode: number;
            } | null;
            streetRef: {
                cityId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nameHe: string;
                streetCode: number;
            } | null;
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
                attributeValue: Prisma.JsonValue;
            }[];
            availabilityBlocks: {
                quantity: number;
                startDate: Date;
                endDate: Date;
                id: string;
                status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
                listingId: string;
                reason: string | null;
            }[];
        } & {
            categoryId: string;
            cityId: string | null;
            streetId: string | null;
            addressNumber: number | null;
            id: string;
            lenderId: string;
            titleHe: string;
            titleEn: string;
            descriptionHe: string;
            descriptionEn: string;
            suitableFor: string | null;
            mainUses: string | null;
            status: import(".prisma/client").$Enums.ListingStatus;
            basePriceDaily: Prisma.Decimal;
            depositAmount: Prisma.Decimal;
            qualityScoreCached: Prisma.Decimal;
            popularityScore: Prisma.Decimal | null;
            manualPriorityBoost: Prisma.Decimal | null;
            pickupLat: Prisma.Decimal;
            pickupLng: Prisma.Decimal;
            pickupAddressText: string;
            city: string | null;
            pickupInstructions: string | null;
            deliverySupported: boolean;
            includedItems: Prisma.JsonValue | null;
            cancellationPolicy: string | null;
            returnTerms: string | null;
            requiresOperator: boolean;
            setupRequired: boolean;
            inventoryCount: number;
            minRentalDays: number;
            maxRentalDays: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    searchActive(q: string | undefined, limit: number): Promise<{
        id: any;
        titleHe: any;
        titleEn: any;
        categoryId: any;
        category: {
            id: any;
            nameHe: any;
        } | null;
        basePriceDaily: any;
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
            value: Prisma.JsonValue;
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
            cityId: string | null;
            streetId: string | null;
            addressNumber: number | null;
            street: string | null;
            area: string | null;
            pickupSummary: string;
            pickupAddressText: string;
            lat: Prisma.Decimal;
            lng: Prisma.Decimal;
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
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        minRentalDays: number;
        maxRentalDays: number;
        deliverySupported: boolean;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
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
            attributesSchema: Prisma.JsonValue | null;
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
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            responseTimeScore: Prisma.Decimal;
            reliabilityScoreCached: Prisma.Decimal;
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
            attributeValue: Prisma.JsonValue;
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
        cityRef: {
            id: string;
            settlementCode: number;
            nameHe: string;
        } | null;
        streetRef: {
            id: string;
            streetCode: number;
            nameHe: string;
        } | null;
    }>;
    create(lenderId: string, dto: CreateListingDto): Promise<{
        cityRef: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            settlementCode: number;
        } | null;
        streetRef: {
            cityId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            streetCode: number;
        } | null;
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
            attributeValue: Prisma.JsonValue;
        }[];
        availabilityBlocks: {
            quantity: number;
            startDate: Date;
            endDate: Date;
            id: string;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            listingId: string;
            reason: string | null;
        }[];
    } & {
        categoryId: string;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        id: string;
        lenderId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        qualityScoreCached: Prisma.Decimal;
        popularityScore: Prisma.Decimal | null;
        manualPriorityBoost: Prisma.Decimal | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: Prisma.JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(lenderId: string, id: string, dto: UpdateListingDto): Promise<{
        cityRef: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            settlementCode: number;
        } | null;
        streetRef: {
            cityId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            streetCode: number;
        } | null;
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
            attributeValue: Prisma.JsonValue;
        }[];
        availabilityBlocks: {
            quantity: number;
            startDate: Date;
            endDate: Date;
            id: string;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            listingId: string;
            reason: string | null;
        }[];
    } & {
        categoryId: string;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        id: string;
        lenderId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        qualityScoreCached: Prisma.Decimal;
        popularityScore: Prisma.Decimal | null;
        manualPriorityBoost: Prisma.Decimal | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: Prisma.JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMedia(lenderId: string, id: string, dto: AddMediaDto): Promise<{
        id: string;
        listingId: string;
        sortOrder: number;
        url: string;
        altText: string;
    }>;
    addAvailabilityBlock(lenderId: string, id: string, dto: CreateAvailabilityBlockDto): Promise<{
        quantity: number;
        startDate: Date;
        endDate: Date;
        id: string;
        status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
        listingId: string;
        reason: string | null;
    }>;
    addPricingRule(lenderId: string, id: string, dto: CreatePricingRuleDto): Promise<{
        id: string;
        listingId: string;
        ruleType: import(".prisma/client").$Enums.PricingRuleType;
        minDays: number | null;
        maxDays: number | null;
        percentDiscount: Prisma.Decimal | null;
        fixedOverride: Prisma.Decimal | null;
        weekendAdjustment: Prisma.Decimal | null;
        seasonalAdjustment: Prisma.Decimal | null;
        startsAt: Date | null;
        endsAt: Date | null;
        metadata: Prisma.JsonValue | null;
    }>;
    lenderListings(lenderId: string): Promise<({
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        };
        cityRef: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            settlementCode: number;
        } | null;
        streetRef: {
            cityId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            streetCode: number;
        } | null;
        media: {
            id: string;
            listingId: string;
            sortOrder: number;
            url: string;
            altText: string;
        }[];
    } & {
        categoryId: string;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        id: string;
        lenderId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        qualityScoreCached: Prisma.Decimal;
        popularityScore: Prisma.Decimal | null;
        manualPriorityBoost: Prisma.Decimal | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: Prisma.JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    publicAvailability(id: string, startDate: string, endDate: string): Promise<{
        available: boolean;
        reason: string | null;
    }>;
    adminFindAll(query: AdminListingQueryDto): Promise<({
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        };
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
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: Prisma.Decimal;
            isFeatured: boolean;
            pickupAreaGeo: Prisma.JsonValue | null;
            reliabilityScoreCached: Prisma.Decimal;
        };
        cityRef: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            settlementCode: number;
        } | null;
        streetRef: {
            cityId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            streetCode: number;
        } | null;
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
            attributeValue: Prisma.JsonValue;
        }[];
        availabilityBlocks: {
            quantity: number;
            startDate: Date;
            endDate: Date;
            id: string;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            listingId: string;
            reason: string | null;
        }[];
    } & {
        categoryId: string;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        id: string;
        lenderId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        qualityScoreCached: Prisma.Decimal;
        popularityScore: Prisma.Decimal | null;
        manualPriorityBoost: Prisma.Decimal | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: Prisma.JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    adminCreate(dto: AdminCreateListingDto, actorUserId?: string): Promise<{
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        };
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
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: Prisma.Decimal;
            isFeatured: boolean;
            pickupAreaGeo: Prisma.JsonValue | null;
            reliabilityScoreCached: Prisma.Decimal;
        };
        cityRef: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            settlementCode: number;
        } | null;
        streetRef: {
            cityId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            streetCode: number;
        } | null;
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
            attributeValue: Prisma.JsonValue;
        }[];
        availabilityBlocks: {
            quantity: number;
            startDate: Date;
            endDate: Date;
            id: string;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            listingId: string;
            reason: string | null;
        }[];
    } & {
        categoryId: string;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        id: string;
        lenderId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        qualityScoreCached: Prisma.Decimal;
        popularityScore: Prisma.Decimal | null;
        manualPriorityBoost: Prisma.Decimal | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: Prisma.JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminUpdate(id: string, dto: AdminUpdateListingDto, actorUserId?: string): Promise<{
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        };
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
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: Prisma.Decimal;
            isFeatured: boolean;
            pickupAreaGeo: Prisma.JsonValue | null;
            reliabilityScoreCached: Prisma.Decimal;
        };
        cityRef: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            settlementCode: number;
        } | null;
        streetRef: {
            cityId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            streetCode: number;
        } | null;
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
            attributeValue: Prisma.JsonValue;
        }[];
        availabilityBlocks: {
            quantity: number;
            startDate: Date;
            endDate: Date;
            id: string;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            listingId: string;
            reason: string | null;
        }[];
    } & {
        categoryId: string;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        id: string;
        lenderId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        qualityScoreCached: Prisma.Decimal;
        popularityScore: Prisma.Decimal | null;
        manualPriorityBoost: Prisma.Decimal | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: Prisma.JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminDelete(id: string, actorUserId?: string): Promise<{
        id: string;
    }>;
    adminDuplicate(id: string, actorUserId?: string): Promise<{
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        };
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
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: Prisma.Decimal;
            isFeatured: boolean;
            pickupAreaGeo: Prisma.JsonValue | null;
            reliabilityScoreCached: Prisma.Decimal;
        };
        cityRef: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            settlementCode: number;
        } | null;
        streetRef: {
            cityId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            streetCode: number;
        } | null;
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
            attributeValue: Prisma.JsonValue;
        }[];
        availabilityBlocks: {
            quantity: number;
            startDate: Date;
            endDate: Date;
            id: string;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            listingId: string;
            reason: string | null;
        }[];
    } & {
        categoryId: string;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        id: string;
        lenderId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        qualityScoreCached: Prisma.Decimal;
        popularityScore: Prisma.Decimal | null;
        manualPriorityBoost: Prisma.Decimal | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: Prisma.JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminChangeOwner(id: string, lenderId: string, actorUserId?: string): Promise<{
        category: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        };
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
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: Prisma.Decimal;
            isFeatured: boolean;
            pickupAreaGeo: Prisma.JsonValue | null;
            reliabilityScoreCached: Prisma.Decimal;
        };
        cityRef: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            settlementCode: number;
        } | null;
        streetRef: {
            cityId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            streetCode: number;
        } | null;
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
            attributeValue: Prisma.JsonValue;
        }[];
        availabilityBlocks: {
            quantity: number;
            startDate: Date;
            endDate: Date;
            id: string;
            status: import(".prisma/client").$Enums.AvailabilityBlockStatus;
            listingId: string;
            reason: string | null;
        }[];
    } & {
        categoryId: string;
        cityId: string | null;
        streetId: string | null;
        addressNumber: number | null;
        id: string;
        lenderId: string;
        titleHe: string;
        titleEn: string;
        descriptionHe: string;
        descriptionEn: string;
        suitableFor: string | null;
        mainUses: string | null;
        status: import(".prisma/client").$Enums.ListingStatus;
        basePriceDaily: Prisma.Decimal;
        depositAmount: Prisma.Decimal;
        qualityScoreCached: Prisma.Decimal;
        popularityScore: Prisma.Decimal | null;
        manualPriorityBoost: Prisma.Decimal | null;
        pickupLat: Prisma.Decimal;
        pickupLng: Prisma.Decimal;
        pickupAddressText: string;
        city: string | null;
        pickupInstructions: string | null;
        deliverySupported: boolean;
        includedItems: Prisma.JsonValue | null;
        cancellationPolicy: string | null;
        returnTerms: string | null;
        requiresOperator: boolean;
        setupRequired: boolean;
        inventoryCount: number;
        minRentalDays: number;
        maxRentalDays: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private buildListingWriteData;
    private buildListingUpdateData;
    private assertRentalDayBounds;
    private resolvePickupLocation;
    private requireLenderOwnedListing;
    private toListingDetailResponse;
    private attributesForResponse;
    private attributeSchemaFields;
    private isAttributeField;
    private categoryBreadcrumb;
    private arrayFromJson;
    private parseAvailabilityDates;
    private availabilityResponseForDates;
    private isLocalDevelopment;
    private mockListingDetail;
}
