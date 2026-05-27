import { AddressesService } from "../addresses/addresses.service";
import { BeamSearchService } from "./beam-search.service";
import { BundleExplanationService } from "./bundle-explanation.service";
import { BundleScoringService } from "./bundle-scoring.service";
import { CandidateFilterService } from "./candidate-filter.service";
import { ParetoFilterService } from "./pareto-filter.service";
import { PreferenceMappingService } from "./preference-mapping.service";
import type { OptimizerRequest, OptimizerRequestBody } from "./bundle-optimizer.types";
export declare class BundleOptimizerService {
    private readonly candidateFilter;
    private readonly beamSearch;
    private readonly scoring;
    private readonly pareto;
    private readonly explanation;
    private readonly addresses;
    private readonly preferenceMapping;
    constructor(candidateFilter: CandidateFilterService, beamSearch: BeamSearchService, scoring: BundleScoringService, pareto: ParetoFilterService, explanation: BundleExplanationService, addresses: AddressesService, preferenceMapping: PreferenceMappingService);
    optimize(input: OptimizerRequestBody | OptimizerRequest): Promise<{
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
                    constraints?: {
                        minPrice?: number | undefined;
                        maxPrice?: number | undefined;
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
                    lat?: number | undefined;
                    lng?: number | undefined;
                    address?: string | undefined;
                    cityId?: string | undefined;
                    streetId?: string | undefined;
                    addressNumber?: number | undefined;
                };
                preferenceProfile: "custom" | "balanced" | "cheapest" | "closest" | "minimalEffort" | "professional" | undefined;
                basePreferenceProfile: "balanced" | "cheapest" | "closest" | "minimalEffort" | "professional" | undefined;
                preferenceSliders: {
                    price: number;
                    distance: number;
                    reliability: number;
                    availability: number;
                    pickupSimplicity: number;
                } | undefined;
                preferences: {
                    weights: {
                        price: number;
                        distance: number;
                        reliability: number;
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
                    constraints?: {
                        minPrice?: number | undefined;
                        maxPrice?: number | undefined;
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
                    lat?: number | undefined;
                    lng?: number | undefined;
                    address?: string | undefined;
                    cityId?: string | undefined;
                    streetId?: string | undefined;
                    addressNumber?: number | undefined;
                };
                preferenceProfile: "custom" | "balanced" | "cheapest" | "closest" | "minimalEffort" | "professional" | undefined;
                basePreferenceProfile: "balanced" | "cheapest" | "closest" | "minimalEffort" | "professional" | undefined;
                preferenceSliders: {
                    price: number;
                    distance: number;
                    reliability: number;
                    availability: number;
                    pickupSimplicity: number;
                } | undefined;
                preferences: {
                    weights: {
                        price: number;
                        distance: number;
                        reliability: number;
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
                        profile: "custom" | "balanced" | "cheapest" | "closest" | "minimalEffort" | "professional";
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
            }[];
        };
    }>;
    private emptyResult;
    private resolveRenterLocation;
}
