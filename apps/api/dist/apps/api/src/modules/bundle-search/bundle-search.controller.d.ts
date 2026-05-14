import { BundleSearchService } from "./bundle-search.service";
export declare class BundleSearchController {
    private readonly bundleSearchService;
    constructor(bundleSearchService: BundleSearchService);
    create(body: any, user?: {
        sub: string;
    }): Promise<any>;
    getSearch(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BundleSearchStatus;
        renterId: string | null;
        maxPickupPoints: number | null;
        requestedItems: import("@prisma/client/runtime/library").JsonValue;
        maxBudget: import("@prisma/client/runtime/library").Decimal | null;
        sameLenderPreferred: boolean;
        deliveryPreferred: boolean;
        exactDatesOnly: boolean;
        searchSessionId: string;
        dateRangeStart: Date;
        dateRangeEnd: Date;
        renterLocationLat: import("@prisma/client/runtime/library").Decimal;
        renterLocationLng: import("@prisma/client/runtime/library").Decimal;
        renterAddressText: string;
        weightPreferences: import("@prisma/client/runtime/library").JsonValue;
        resultsSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
        debugSnapshot: import("@prisma/client/runtime/library").JsonValue | null;
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
}
