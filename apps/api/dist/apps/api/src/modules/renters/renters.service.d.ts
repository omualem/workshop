import { PrismaService } from "../../prisma/prisma.service";
export declare class RentersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    me(userId: string): Promise<{
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
    savedSearches(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        renterId: string;
        searchPayload: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    favorites(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
                url: string;
                id: string;
                sortOrder: number;
                listingId: string;
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
            suitableFor: string | null;
            mainUses: string | null;
            condition: import(".prisma/client").$Enums.ListingCondition;
            status: import(".prisma/client").$Enums.ListingStatus;
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
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        listingId: string;
        renterId: string;
    })[]>;
}
