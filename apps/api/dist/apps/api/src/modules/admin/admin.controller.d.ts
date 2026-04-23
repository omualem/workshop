import { UpdateRankingConfigDto } from "./dto/update-ranking-config.dto";
import { AdminService } from "./admin.service";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    bundleSearchDebug(id: string): Promise<{
        candidates: ({
            items: {
                quantity: number;
                id: string;
                bundleCandidateId: string;
                requestedSlotKey: string;
                listingId: string;
                lenderId: string;
                contributionScores: import("@prisma/client/runtime/library").JsonValue;
            }[];
        } & {
            id: string;
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
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            totalDistanceKm: import("@prisma/client/runtime/library").Decimal;
            pickupPointsCount: number;
            lendersCount: number;
            exactAvailabilityFit: boolean;
            label: string | null;
        })[];
    } & {
        status: import(".prisma/client").$Enums.BundleSearchStatus;
        requestedItems: import("@prisma/client/runtime/library").JsonValue;
        maxBudget: import("@prisma/client/runtime/library").Decimal | null;
        maxPickupPoints: number | null;
        sameLenderPreferred: boolean;
        deliveryPreferred: boolean;
        exactDatesOnly: boolean;
        id: string;
        renterId: string | null;
        searchSessionId: string;
        dateRangeStart: Date;
        dateRangeEnd: Date;
        renterLocationLat: import("@prisma/client/runtime/library").Decimal;
        renterLocationLng: import("@prisma/client/runtime/library").Decimal;
        renterAddressText: string;
        weightPreferences: import("@prisma/client/runtime/library").JsonValue;
        resultsSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        debugSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRankingConfig(user: {
        sub: string;
    }, dto: UpdateRankingConfigDto): Promise<{
        weights: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        updatedAt: Date;
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
        action: string;
        entityType: string;
        entityId: string;
        before: import("@prisma/client/runtime/library").JsonValue | null;
        after: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        actorUserId: string | null;
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
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
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
        })[];
    }>;
}
