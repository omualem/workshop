import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../shared/redis/redis.service";
import { BundleExplanationService } from "./bundle-explanation.service";
import { BundleGenerationService } from "./bundle-generation.service";
import { RankingConfigService } from "./ranking-config.service";
import { BundleScoringService } from "./bundle-scoring.service";
import type { BundleSearchInput } from "@rental/types";
export declare class BundleSearchService {
    private readonly prisma;
    private readonly redisService;
    private readonly rankingConfigService;
    private readonly generationService;
    private readonly scoringService;
    private readonly explanationService;
    constructor(prisma: PrismaService, redisService: RedisService, rankingConfigService: RankingConfigService, generationService: BundleGenerationService, scoringService: BundleScoringService, explanationService: BundleExplanationService);
    create(input: BundleSearchInput, renterId?: string): Promise<any>;
    getSearch(id: string): Promise<{
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
    getResults(id: string): Promise<{
        searchId: string;
        requestedItems: import("@prisma/client/runtime/library").JsonValue;
        topRankedBundles: {
            id: any;
            label: any;
            overallScore: number | null;
            scores: {
                price: number | null;
                reliability: number | null;
                logistics: number | null;
                availability: number | null;
                quality: number | null;
                stability: number | null;
            };
            explanation: any;
            pickupPointsCount: any;
            totalEstimatedDistanceKm: number | null;
            totalBundlePrice: number | null;
            exactAvailabilityFit: any;
            includedItems: any;
        }[];
        alternateBundles: {
            id: any;
            label: any;
            overallScore: number | null;
            scores: {
                price: number | null;
                reliability: number | null;
                logistics: number | null;
                availability: number | null;
                quality: number | null;
                stability: number | null;
            };
            explanation: any;
            pickupPointsCount: any;
            totalEstimatedDistanceKm: number | null;
            totalBundlePrice: number | null;
            exactAvailabilityFit: any;
            includedItems: any;
        }[];
        labels: {
            bestBalanced: any;
            bestPrice: any;
            easiestPickup: any;
            mostReliable: any;
        };
        observability: import("@prisma/client/runtime/library").JsonValue;
    }>;
    recompute(id: string): Promise<any>;
    debugSearch(id: string): Promise<{
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
    private buildCacheKey;
    private selectCuratedBundles;
}
