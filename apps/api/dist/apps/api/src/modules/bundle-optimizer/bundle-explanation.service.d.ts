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
            condition: number;
            availability: number;
        };
        scoreBreakdown: {
            weightedUtility: number;
            variancePenalty: number;
            bottleneckTerm: number;
            pickupPenalty: number;
            maxDistancePenalty: number;
            finalScore: number;
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
            condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE";
            price: number;
            distanceKm: number;
            attributes: {
                attributeKey: string;
                attributeValue: unknown;
            }[];
        }[];
    };
    private pickLabel;
}
