import { UpdateRankingConfigDto } from "./dto/update-ranking-config.dto";
import { AdminService } from "./admin.service";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    bundleSearchDebug(id: string): Promise<{
        candidates: ({
            items: {
                id: string;
                listingId: string;
                lenderId: string;
                quantity: number;
                bundleCandidateId: string;
                requestedSlotKey: string;
                contributionScores: import("@prisma/client/runtime/library").JsonValue;
            }[];
        } & {
            id: string;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            rankIndex: number;
            searchRequestId: string;
            scoreTotal: import("@prisma/client/runtime/library").Decimal;
            priceScore: import("@prisma/client/runtime/library").Decimal;
            reliabilityScore: import("@prisma/client/runtime/library").Decimal;
            logisticsScore: import("@prisma/client/runtime/library").Decimal;
            availabilityScore: import("@prisma/client/runtime/library").Decimal;
            productQualityScore: import("@prisma/client/runtime/library").Decimal;
            stabilityScore: import("@prisma/client/runtime/library").Decimal;
            explanation: import("@prisma/client/runtime/library").JsonValue;
            debugData: import("@prisma/client/runtime/library").JsonValue | null;
            totalDistanceKm: import("@prisma/client/runtime/library").Decimal;
            pickupPointsCount: number;
            lendersCount: number;
            exactAvailabilityFit: boolean;
            label: string | null;
        })[];
    } & {
        id: string;
        renterId: string | null;
        status: import(".prisma/client").$Enums.BundleSearchStatus;
        createdAt: Date;
        updatedAt: Date;
        maxPickupPoints: number | null;
        searchSessionId: string;
        dateRangeStart: Date;
        dateRangeEnd: Date;
        requestedItems: import("@prisma/client/runtime/library").JsonValue;
        renterLocationLat: import("@prisma/client/runtime/library").Decimal;
        renterLocationLng: import("@prisma/client/runtime/library").Decimal;
        renterAddressText: string;
        weightPreferences: import("@prisma/client/runtime/library").JsonValue;
        resultsSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        debugSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        maxBudget: import("@prisma/client/runtime/library").Decimal | null;
        sameLenderPreferred: boolean;
        deliveryPreferred: boolean;
        exactDatesOnly: boolean;
    }>;
    updateRankingConfig(user: {
        sub: string;
    }, dto: UpdateRankingConfigDto): Promise<{
        id: string;
        updatedAt: Date;
        weights: import("@prisma/client/runtime/library").JsonValue;
        presetKey: string;
        displayNameHe: string;
        lowScoreThreshold: import("@prisma/client/runtime/library").Decimal;
        stdDevAlpha: import("@prisma/client/runtime/library").Decimal;
        lowScoreBeta: import("@prisma/client/runtime/library").Decimal;
        bottleneckGamma: import("@prisma/client/runtime/library").Decimal;
        updatedByUserId: string | null;
    }>;
    auditLogs(): import(".prisma/client").Prisma.PrismaPromise<({
        actor: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            fullName: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        actorUserId: string | null;
        action: string;
        entityType: string;
        entityId: string;
        before: import("@prisma/client/runtime/library").JsonValue | null;
        after: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    overview(): Promise<{
        users: number;
        lenders: number;
        renters: number;
        listings: number;
        bundleSearches: number;
        disputes: number;
    }>;
    catalogOptions(): Promise<{
        categories: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameHe: string;
        }[];
        lenders: ({
            user: {
                id: string;
                fullName: string;
                email: string;
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
        })[];
    }>;
    users(): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        locale: string;
        createdAt: Date;
        hasRenterProfile: boolean;
        hasLenderProfile: boolean;
        lenderDisplayName: string | null;
    }[]>;
    moderationQueue(): Promise<({
        lender: {
            userId: string;
            displayName: string;
        };
        category: {
            id: string;
            slug: string;
            nameHe: string;
        };
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
    bookings(): Promise<({
        renter: {
            id: string;
            fullName: string;
            email: string;
        };
        items: ({
            listing: {
                id: string;
                titleHe: string;
            };
            lender: {
                userId: string;
                displayName: string;
            };
        } & {
            id: string;
            bookingId: string;
            listingId: string;
            lenderId: string;
            quantity: number;
            itemPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            pickupMethod: import(".prisma/client").$Enums.PickupMethod;
            pickupWindow: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        renterId: string;
        bundleCandidateId: string | null;
        status: import(".prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        totalDeposit: import("@prisma/client/runtime/library").Decimal;
        logisticsScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        reliabilityScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentReference: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    disputes(): Promise<({
        booking: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
        };
        openedBy: {
            id: string;
            fullName: string;
            email: string;
        };
        assignedAdmin: {
            id: string;
            fullName: string;
            email: string;
        } | null;
    } & {
        id: string;
        bookingId: string;
        status: import(".prisma/client").$Enums.DisputeStatus;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        openedByUserId: string;
        assignedAdminId: string | null;
        resolutionNote: string | null;
    })[]>;
    reviews(): Promise<({
        listing: {
            id: string;
            titleHe: string;
        } | null;
        reviewer: {
            id: string;
            fullName: string;
            email: string;
        };
        reviewee: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        bookingId: string;
        listingId: string | null;
        createdAt: Date;
        reviewerId: string;
        revieweeUserId: string;
        rating: number;
        text: string;
        tags: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    rankingConfig(): Promise<({
        updatedBy: {
            id: string;
            fullName: string;
            email: string;
        } | null;
    } & {
        id: string;
        updatedAt: Date;
        weights: import("@prisma/client/runtime/library").JsonValue;
        presetKey: string;
        displayNameHe: string;
        lowScoreThreshold: import("@prisma/client/runtime/library").Decimal;
        stdDevAlpha: import("@prisma/client/runtime/library").Decimal;
        lowScoreBeta: import("@prisma/client/runtime/library").Decimal;
        bottleneckGamma: import("@prisma/client/runtime/library").Decimal;
        updatedByUserId: string | null;
    })[]>;
}
