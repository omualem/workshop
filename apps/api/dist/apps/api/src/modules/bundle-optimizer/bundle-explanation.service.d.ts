import type { ScoredBundle } from "./bundle-optimizer.types";
export declare class BundleExplanationService {
    build(scored: ScoredBundle, budget: number): {
        label: string;
        score: number;
        totalPrice: number;
        budget: number;
        pickupPointCount: number;
        metrics: {
            price: number;
            distance: number;
            reliability: number;
            availability: number;
        };
        scoreBreakdown: {
            weightedUtility: number;
            variancePenalty: number;
            bottleneckTerm: number;
            pickupPenalty: number;
            maxDistancePenalty: number;
            lowScorePenalty: number;
            rawFinalScore: number;
            finalScore: number;
            preferences: {
                profile: "balanced" | "cheapest" | "closest" | "minimalEffort" | "professional" | "custom";
                baseProfile: "balanced" | "cheapest" | "closest" | "minimalEffort" | "professional" | undefined;
                sliders: {
                    price: number;
                    distance: number;
                    reliability: number;
                    availability: number;
                    pickupSimplicity: number;
                };
                normalizedWeights: {
                    price: number;
                    distance: number;
                    reliability: number;
                    availability: number;
                };
                penaltyMultipliers: {
                    pickup: number;
                    lowScore: {
                        price: number;
                        distance: number;
                        reliability: number;
                        availability: number;
                    };
                    maxDistance: number;
                    variance: number;
                    bottleneck: number;
                };
            };
        };
        lowScorePenaltyBreakdown: {
            price: number;
            distance: number;
            reliability: number;
            availability: number;
        };
        derived: {
            avgDistance: number;
            maxDistance: number;
            pickupCost: number;
            pickupStops: number;
            deviationDaysSum: number;
        };
        penalties: {
            variance: number;
            pickup: number;
            distanceMaxPenalty: number;
        };
        explanations: string[];
        tradeoffs: string[];
        includedItems: {
            slotKey: string;
            listingId: string;
            lenderId: string;
            titleHe: string;
            titleEn: string;
            price: number;
            distanceKm: number;
            attributes: {
                attributeKey: string;
                attributeValue: unknown;
            }[];
            reliabilityBreakdown: {
                lenderReliability: number;
                itemAverageRating: number;
                itemDistinctRatingCount: number;
                itemRatingConfidence: number;
                adjustedItemRating: number;
                itemRatingScore: number | null;
                insufficientRatingInfo: boolean;
                finalReliabilityScore: number;
            };
        }[];
    };
    private weakestBy;
    private pickLabel;
    private preferenceProfileExplanation;
}
