import { RentersService } from "./renters.service";
export declare class RentersController {
    private readonly rentersService;
    constructor(rentersService: RentersService);
    me(user: {
        sub: string;
    }): Promise<{
        user: {
            status: import(".prisma/client").$Enums.UserStatus;
            id: string;
            fullName: string;
            email: string;
            phone: string;
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
        name: string;
        id: string;
        renterId: string;
        createdAt: Date;
        searchPayload: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    favorites(user: {
        sub: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        listing: {
            category: {
                status: import(".prisma/client").$Enums.CategoryStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                slug: string;
                nameHe: string;
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
                url: string;
                id: string;
                sortOrder: number;
                listingId: string;
                altText: string;
            }[];
        } & {
            status: import(".prisma/client").$Enums.ListingStatus;
            categoryId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            lenderId: string;
            titleHe: string;
            titleEn: string;
            descriptionHe: string;
            descriptionEn: string;
            condition: import(".prisma/client").$Enums.ListingCondition;
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
        };
    } & {
        id: string;
        renterId: string;
        createdAt: Date;
        listingId: string;
    })[]>;
}
