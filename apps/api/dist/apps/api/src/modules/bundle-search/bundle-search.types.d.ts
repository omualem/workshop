import type { BundleSearchInput, RequestedItemInput, RankingWeights } from "@rental/types";
export type ListingWithRelations = {
    id: string;
    lenderId: string;
    categoryId: string;
    titleHe: string;
    titleEn: string;
    descriptionHe: string;
    descriptionEn: string;
    condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE";
    status: string;
    basePriceDaily: number;
    depositAmount: number;
    qualityScoreCached: number;
    pickupLat: number;
    pickupLng: number;
    pickupAddressText: string;
    deliverySupported: boolean;
    inventoryCount: number;
    minRentalDays: number;
    maxRentalDays: number;
    createdAt: Date;
    updatedAt: Date;
    lender: {
        averageRating: number;
        completedTransactionsCount: number;
        cancellationRate: number;
        lateReturnRate: number;
        complaintRate: number;
        verificationLevel: "BASIC" | "VERIFIED" | "TRUSTED";
        responseTimeScore: number;
    };
    media: Array<{
        id: string;
    }>;
    attributeValues: Array<{
        attributeKey: string;
        attributeValue: unknown;
    }>;
    pricingRules: Array<{
        ruleType: string;
        minDays: number | null;
        maxDays: number | null;
        percentDiscount: number | null;
        fixedOverride: number | null;
        weekendAdjustment: number | null;
        seasonalAdjustment: number | null;
    }>;
    reviews: Array<{
        rating: number;
    }>;
};
export type SlotCandidate = {
    slot: RequestedItemInput;
    listing: ListingWithRelations | null;
    omitted?: boolean;
    estimatedPrice: number;
    distanceKm: number;
    reliabilityScore: number;
    qualityScore: number;
    availabilityFitScore: number;
    prelimScore: number;
};
export type GeneratedBundle = {
    items: SlotCandidate[];
    totalPrice: number;
    totalDistanceKm: number;
    pickupPointsCount: number;
    lendersCount: number;
    exactAvailabilityFit: boolean;
    requestedItemsCount: number;
};
export type BundleSearchComputation = {
    input: BundleSearchInput;
    weights: RankingWeights;
    slotCandidates: Record<string, SlotCandidate[]>;
    bundles: GeneratedBundle[];
    timings: {
        candidateFetchMs: number;
        bundleGenerationMs: number;
        scoringMs: number;
    };
    candidateCounts: Record<string, {
        beforePruning: number;
        afterPruning: number;
    }>;
};
