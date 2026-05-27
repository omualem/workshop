import { RentersService } from "./renters.service";
export declare class RentersController {
    private readonly rentersService;
    constructor(rentersService: RentersService);
    me(user: {
        sub: string;
    }): Promise<{
        user: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            status: import(".prisma/client").$Enums.UserStatus;
        };
    } & {
        defaultLocationLat: import("@prisma/client/runtime/library").Decimal | null;
        defaultLocationLng: import("@prisma/client/runtime/library").Decimal | null;
        defaultAddressText: string | null;
        preferences: import("@prisma/client/runtime/library").JsonValue | null;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        userId: string;
    }>;
    savedSearches(user: {
        sub: string;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        renterId: string;
        searchPayload: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    favorites(user: {
        sub: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        listing: {
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nameHe: string;
                status: import(".prisma/client").$Enums.CategoryStatus;
                parentId: string | null;
                slug: string;
                nameEn: string;
                attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
            };
            lender: {
                createdAt: Date;
                updatedAt: Date;
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
                userId: string;
            };
            media: {
                id: string;
                listingId: string;
                url: string;
                sortOrder: number;
                altText: string;
            }[];
        } & {
            city: string | null;
            cityId: string | null;
            streetId: string | null;
            addressNumber: number | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ListingStatus;
            lenderId: string;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            categoryId: string;
            titleHe: string;
            titleEn: string;
            descriptionHe: string;
            descriptionEn: string;
            suitableFor: string | null;
            mainUses: string | null;
            basePriceDaily: import("@prisma/client/runtime/library").Decimal;
            qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
            popularityScore: import("@prisma/client/runtime/library").Decimal | null;
            manualPriorityBoost: import("@prisma/client/runtime/library").Decimal | null;
            pickupLat: import("@prisma/client/runtime/library").Decimal;
            pickupLng: import("@prisma/client/runtime/library").Decimal;
            pickupAddressText: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        listingId: string;
        renterId: string;
    })[]>;
}
