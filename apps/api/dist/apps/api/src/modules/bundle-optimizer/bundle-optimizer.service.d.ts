import { BeamSearchService } from "./beam-search.service";
import { BundleExplanationService } from "./bundle-explanation.service";
import { BundleScoringService } from "./bundle-scoring.service";
import { CandidateFilterService } from "./candidate-filter.service";
import { ParetoFilterService } from "./pareto-filter.service";
import type { OptimizerRequest } from "./bundle-optimizer.types";
export declare class BundleOptimizerService {
    private readonly candidateFilter;
    private readonly beamSearch;
    private readonly scoring;
    private readonly pareto;
    private readonly explanation;
    constructor(candidateFilter: CandidateFilterService, beamSearch: BeamSearchService, scoring: BundleScoringService, pareto: ParetoFilterService, explanation: BundleExplanationService);
    optimize(request: OptimizerRequest): Promise<{
        success: boolean;
        data: {
            debug?: {
                slotsCount: number;
                topKPerSlot: number;
                beamWidth: number;
                maxPickupPoints: number | undefined;
                candidateCountsBeforeFiltering: Record<string, number>;
                candidateCountsAfterFiltering: Record<string, number>;
                candidateCountsAfterTopK: Record<string, number>;
                filteredByAvailability: Record<string, number>;
                filteredByRentalDays: Record<string, number>;
                filteredByDistance: Record<string, number>;
                distance: {};
                availability: {};
                searchSpace: {
                    initial: string;
                    afterFiltering: number;
                    afterTopK: number;
                    afterBeam: number;
                    afterPareto: number;
                };
            } | undefined;
            requestSummary: {
                slots: {
                    slotKey: string;
                    mode: "category" | "specificListing";
                    quantity: number;
                    categoryId?: string | undefined;
                    specificListingId?: string | undefined;
                    minCondition?: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE" | undefined;
                    constraints?: {
                        minPrice?: number | undefined;
                        maxPrice?: number | undefined;
                        minCondition?: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE" | undefined;
                        maxDistanceKm?: number | undefined;
                        allowAlternatives?: boolean | undefined;
                    } | undefined;
                }[];
                dateRange: {
                    startDate: string;
                    endDate: string;
                };
                budget: number;
                maxPickupPoints: number | undefined;
                userLocation: {
                    lat: number;
                    lng: number;
                    address?: string | undefined;
                };
                preferences: {
                    weights: {
                        price: number;
                        distance: number;
                        reliability: number;
                        condition: number;
                        availability: number;
                    };
                    lambdaVariance: number;
                    alphaBottleneck: number;
                    betaPickup: number;
                    gammaMaxDistance: number;
                    alphaDistanceMix: number;
                    topKPerSlot: number;
                    beamWidth: number;
                };
            };
            bundles: never[];
            messageHe: string;
            suggestions: string[];
        };
    } | {
        success: boolean;
        data: {
            debug?: {
                slotsCount: number;
                topKPerSlot: number;
                beamWidth: number;
                maxPickupPoints: number | undefined;
                candidateCountsBeforeFiltering: Record<string, number>;
                candidateCountsAfterFiltering: Record<string, number>;
                candidateCountsAfterTopK: Record<string, number>;
                filteredByAvailability: Record<string, number>;
                filteredByRentalDays: Record<string, number>;
                filteredByDistance: Record<string, number>;
                distance: Record<string, import("./bundle-optimizer.types").SlotFilterDebug[]>;
                availability: Record<string, import("./bundle-optimizer.types").SlotFilterDebug[]>;
                searchSpace: {
                    initial: string;
                    initialEstimate: number;
                    afterFiltering: number;
                    afterTopK: number;
                    afterBeam: number;
                    afterPareto: number;
                };
                beamStats: {
                    expanded: number;
                    prunedByBudget: number;
                    prunedByEarlyBound: number;
                    prunedByPickupCap: number;
                    prunedByInventory: number;
                    beamRetained: number;
                };
                paretoRemoved: number;
            } | undefined;
            requestSummary: {
                slots: {
                    slotKey: string;
                    mode: "category" | "specificListing";
                    quantity: number;
                    categoryId?: string | undefined;
                    specificListingId?: string | undefined;
                    minCondition?: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE" | undefined;
                    constraints?: {
                        minPrice?: number | undefined;
                        maxPrice?: number | undefined;
                        minCondition?: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE" | undefined;
                        maxDistanceKm?: number | undefined;
                        allowAlternatives?: boolean | undefined;
                    } | undefined;
                }[];
                dateRange: {
                    startDate: string;
                    endDate: string;
                };
                budget: number;
                maxPickupPoints: number | undefined;
                userLocation: {
                    lat: number;
                    lng: number;
                    address?: string | undefined;
                };
                preferences: {
                    weights: {
                        price: number;
                        distance: number;
                        reliability: number;
                        condition: number;
                        availability: number;
                    };
                    lambdaVariance: number;
                    alphaBottleneck: number;
                    betaPickup: number;
                    gammaMaxDistance: number;
                    alphaDistanceMix: number;
                    topKPerSlot: number;
                    beamWidth: number;
                };
            };
            algorithm: {
                name: string;
                method: string;
                complexity: string;
                formula: string;
            };
            bundles: {
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
            }[];
        };
    }>;
    private emptyResult;
}
