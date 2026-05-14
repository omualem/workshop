import { z } from "zod";
export declare const conditionEnum: z.ZodEnum<{
    NEW: "NEW";
    LIKE_NEW: "LIKE_NEW";
    GOOD: "GOOD";
    FAIR: "FAIR";
    HEAVY_USE: "HEAVY_USE";
}>;
export type ConditionLevel = z.infer<typeof conditionEnum>;
export declare const slotConstraintsSchema: z.ZodOptional<z.ZodObject<{
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    minCondition: z.ZodOptional<z.ZodEnum<{
        NEW: "NEW";
        LIKE_NEW: "LIKE_NEW";
        GOOD: "GOOD";
        FAIR: "FAIR";
        HEAVY_USE: "HEAVY_USE";
    }>>;
    maxDistanceKm: z.ZodOptional<z.ZodNumber>;
    allowAlternatives: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>;
export declare const slotInputSchema: z.ZodObject<{
    slotKey: z.ZodString;
    mode: z.ZodDefault<z.ZodEnum<{
        category: "category";
        specificListing: "specificListing";
    }>>;
    categoryId: z.ZodOptional<z.ZodString>;
    specificListingId: z.ZodOptional<z.ZodString>;
    quantity: z.ZodDefault<z.ZodNumber>;
    minCondition: z.ZodOptional<z.ZodEnum<{
        NEW: "NEW";
        LIKE_NEW: "LIKE_NEW";
        GOOD: "GOOD";
        FAIR: "FAIR";
        HEAVY_USE: "HEAVY_USE";
    }>>;
    constraints: z.ZodOptional<z.ZodObject<{
        minPrice: z.ZodOptional<z.ZodNumber>;
        maxPrice: z.ZodOptional<z.ZodNumber>;
        minCondition: z.ZodOptional<z.ZodEnum<{
            NEW: "NEW";
            LIKE_NEW: "LIKE_NEW";
            GOOD: "GOOD";
            FAIR: "FAIR";
            HEAVY_USE: "HEAVY_USE";
        }>>;
        maxDistanceKm: z.ZodOptional<z.ZodNumber>;
        allowAlternatives: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const optimizerWeightsSchema: z.ZodObject<{
    price: z.ZodNumber;
    distance: z.ZodNumber;
    reliability: z.ZodNumber;
    condition: z.ZodNumber;
    availability: z.ZodNumber;
}, z.core.$strip>;
export declare const preferenceProfileSchema: z.ZodEnum<{
    custom: "custom";
    balanced: "balanced";
    cheapest: "cheapest";
    closest: "closest";
    minimalEffort: "minimalEffort";
    professional: "professional";
    highQuality: "highQuality";
}>;
export declare const basePreferenceProfileSchema: z.ZodEnum<{
    balanced: "balanced";
    cheapest: "cheapest";
    closest: "closest";
    minimalEffort: "minimalEffort";
    professional: "professional";
    highQuality: "highQuality";
}>;
export declare const preferenceSlidersSchema: z.ZodObject<{
    price: z.ZodNumber;
    distance: z.ZodNumber;
    reliability: z.ZodNumber;
    condition: z.ZodNumber;
    availability: z.ZodNumber;
    pickupSimplicity: z.ZodNumber;
}, z.core.$strip>;
export declare const optimizerPreferencesSchema: z.ZodObject<{
    weights: z.ZodDefault<z.ZodObject<{
        price: z.ZodNumber;
        distance: z.ZodNumber;
        reliability: z.ZodNumber;
        condition: z.ZodNumber;
        availability: z.ZodNumber;
    }, z.core.$strip>>;
    lambdaVariance: z.ZodDefault<z.ZodNumber>;
    alphaBottleneck: z.ZodDefault<z.ZodNumber>;
    betaPickup: z.ZodDefault<z.ZodNumber>;
    gammaMaxDistance: z.ZodDefault<z.ZodNumber>;
    alphaDistanceMix: z.ZodDefault<z.ZodNumber>;
    topKPerSlot: z.ZodDefault<z.ZodNumber>;
    beamWidth: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const optimizerRequestSchema: z.ZodObject<{
    slots: z.ZodArray<z.ZodObject<{
        slotKey: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<{
            category: "category";
            specificListing: "specificListing";
        }>>;
        categoryId: z.ZodOptional<z.ZodString>;
        specificListingId: z.ZodOptional<z.ZodString>;
        quantity: z.ZodDefault<z.ZodNumber>;
        minCondition: z.ZodOptional<z.ZodEnum<{
            NEW: "NEW";
            LIKE_NEW: "LIKE_NEW";
            GOOD: "GOOD";
            FAIR: "FAIR";
            HEAVY_USE: "HEAVY_USE";
        }>>;
        constraints: z.ZodOptional<z.ZodObject<{
            minPrice: z.ZodOptional<z.ZodNumber>;
            maxPrice: z.ZodOptional<z.ZodNumber>;
            minCondition: z.ZodOptional<z.ZodEnum<{
                NEW: "NEW";
                LIKE_NEW: "LIKE_NEW";
                GOOD: "GOOD";
                FAIR: "FAIR";
                HEAVY_USE: "HEAVY_USE";
            }>>;
            maxDistanceKm: z.ZodOptional<z.ZodNumber>;
            allowAlternatives: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    dateRange: z.ZodObject<{
        startDate: z.ZodString;
        endDate: z.ZodString;
    }, z.core.$strip>;
    userLocation: z.ZodObject<{
        lat: z.ZodOptional<z.ZodNumber>;
        lng: z.ZodOptional<z.ZodNumber>;
        address: z.ZodOptional<z.ZodString>;
        cityId: z.ZodOptional<z.ZodString>;
        streetId: z.ZodOptional<z.ZodString>;
        addressNumber: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    budget: z.ZodNumber;
    maxPickupPoints: z.ZodOptional<z.ZodNumber>;
    preferenceProfile: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        balanced: "balanced";
        cheapest: "cheapest";
        closest: "closest";
        minimalEffort: "minimalEffort";
        professional: "professional";
        highQuality: "highQuality";
    }>>;
    basePreferenceProfile: z.ZodOptional<z.ZodEnum<{
        balanced: "balanced";
        cheapest: "cheapest";
        closest: "closest";
        minimalEffort: "minimalEffort";
        professional: "professional";
        highQuality: "highQuality";
    }>>;
    preferenceSliders: z.ZodOptional<z.ZodObject<{
        price: z.ZodNumber;
        distance: z.ZodNumber;
        reliability: z.ZodNumber;
        condition: z.ZodNumber;
        availability: z.ZodNumber;
        pickupSimplicity: z.ZodNumber;
    }, z.core.$strip>>;
    preferences: z.ZodDefault<z.ZodObject<{
        weights: z.ZodDefault<z.ZodObject<{
            price: z.ZodNumber;
            distance: z.ZodNumber;
            reliability: z.ZodNumber;
            condition: z.ZodNumber;
            availability: z.ZodNumber;
        }, z.core.$strip>>;
        lambdaVariance: z.ZodDefault<z.ZodNumber>;
        alphaBottleneck: z.ZodDefault<z.ZodNumber>;
        betaPickup: z.ZodDefault<z.ZodNumber>;
        gammaMaxDistance: z.ZodDefault<z.ZodNumber>;
        alphaDistanceMix: z.ZodDefault<z.ZodNumber>;
        topKPerSlot: z.ZodDefault<z.ZodNumber>;
        beamWidth: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type OptimizerWeights = z.infer<typeof optimizerWeightsSchema>;
export type OptimizerPreferences = z.infer<typeof optimizerPreferencesSchema>;
export type PreferenceProfile = z.infer<typeof preferenceProfileSchema>;
export type BasePreferenceProfile = z.infer<typeof basePreferenceProfileSchema>;
export type PreferenceSliders = z.infer<typeof preferenceSlidersSchema>;
export type OptimizerRequest = z.infer<typeof optimizerRequestSchema>;
export type SlotInput = z.infer<typeof slotInputSchema>;
export type SlotConstraints = NonNullable<z.infer<typeof slotConstraintsSchema>>;
export interface CandidateItem {
    slotKey: string;
    listingId: string;
    lenderId: string;
    pickupKey: string;
    titleHe: string;
    titleEn: string;
    categoryId: string;
    condition: ConditionLevel;
    price: number;
    distanceKm: number;
    reliability: number;
    conditionScore: number;
    availability: number;
    pickupLat: number;
    pickupLng: number;
    inventoryCount: number;
    lenderCompletedTransactions?: number;
    attributeValues: Array<{
        attributeKey: string;
        attributeValue: unknown;
    }>;
    deviationDays: number;
    m_price: number;
    m_distance: number;
    m_reliability: number;
    m_condition: number;
    m_availability: number;
    preliminaryScore: number;
}
export interface SlotFilterDebug {
    listingId: string;
    titleHe: string;
    distanceKm: number;
    availability: boolean;
    durationDays: number;
    minRentalDays: number;
    maxRentalDays: number;
    filteredOutBy?: "availability" | "rentalDays" | "distance";
}
export interface SelectedBundle {
    items: CandidateItem[];
    totalPrice: number;
    uniqueLenderCount: number;
    uniquePickupCount: number;
}
export interface BundleMetrics {
    price: number;
    distance: number;
    reliability: number;
    condition: number;
    availability: number;
}
export interface ScoreBreakdown {
    weightedUtility: number;
    variancePenalty: number;
    bottleneckTerm: number;
    pickupPenalty: number;
    maxDistancePenalty: number;
    lowScorePenalty: number;
    lowScorePenaltyBreakdown: {
        price: number;
        distance: number;
        reliability: number;
        condition: number;
        availability: number;
    };
    preferences: {
        profile: PreferenceProfile;
        baseProfile?: BasePreferenceProfile;
        sliders: PreferenceSliders;
        normalizedWeights: OptimizerWeights;
        penaltyMultipliers: {
            pickup: number;
            lowScore: {
                price: number;
                distance: number;
                reliability: number;
                condition: number;
                availability: number;
            };
            maxDistance: number;
            variance: number;
            bottleneck: number;
        };
    };
    rawFinalScore: number;
    finalScore: number;
}
export interface ResolvedOptimizerPreferences {
    profile: PreferenceProfile;
    baseProfile?: BasePreferenceProfile;
    sliders: PreferenceSliders;
    weights: OptimizerWeights;
    penaltyWeights: ScoreBreakdown["preferences"]["penaltyMultipliers"];
}
export interface DerivedQuantities {
    avgDistance: number;
    maxDistance: number;
    pickupCost: number;
    pickupStops: number;
    deviationDaysSum: number;
}
export interface ScoredBundle {
    bundle: SelectedBundle;
    metrics: BundleMetrics;
    derived: DerivedQuantities;
    breakdown: ScoreBreakdown;
}
