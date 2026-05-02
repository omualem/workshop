import { RentersService } from "./renters.service";
export declare class RentersController {
    private readonly rentersService;
    constructor(rentersService: RentersService);
    me(user: {
        sub: string;
    }): Promise<{
        user: {
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            fullName: string;
            email: string;
            phone: string;
        };
    } & {
        userId: string;
        defaultLocationLat: import("@prisma/client/runtime/library").Decimal | null;
        defaultLocationLng: import("@prisma/client/runtime/library").Decimal | null;
        defaultAddressText: string | null;
        preferences: import("@prisma/client/runtime/library").JsonValue | null;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
    }>;
    savedSearches(user: {
        sub: string;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        renterId: string;
        createdAt: Date;
        name: string;
        searchPayload: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    favorites(user: {
        sub: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        listing: {
            lender: {
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
                url: string;
                sortOrder: number;
                altText: string;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            lenderId: string;
            categoryId: string;
            titleHe: string;
            titleEn: string;
            descriptionHe: string;
            descriptionEn: string;
            suitableFor: string | null;
            mainUses: string | null;
            condition: import(".prisma/client").$Enums.ListingCondition;
            basePriceDaily: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
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
        };
    } & {
        id: string;
        renterId: string;
        createdAt: Date;
        listingId: string;
    })[]>;
}
