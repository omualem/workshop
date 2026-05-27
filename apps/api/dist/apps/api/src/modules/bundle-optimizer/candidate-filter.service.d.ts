import { PrismaService } from "../../prisma/prisma.service";
import { AvailabilityService } from "../availability/availability.service";
import { PricingService } from "../pricing/pricing.service";
import { LenderReliabilityService } from "./lender-reliability.service";
import { ListingRatingService } from "./listing-rating.service";
import { MetricNormalizationService } from "./metric-normalization.service";
import type { CandidateItem, OptimizerRequest, SlotFilterDebug, SlotInput } from "./bundle-optimizer.types";
export declare class CandidateFilterService {
    private readonly prisma;
    private readonly availability;
    private readonly pricing;
    private readonly reliability;
    private readonly normalization;
    private readonly listingRating;
    constructor(prisma: PrismaService, availability: AvailabilityService, pricing: PricingService, reliability: LenderReliabilityService, normalization: MetricNormalizationService, listingRating: ListingRatingService);
    buildCandidatesPerSlot(req: OptimizerRequest): Promise<{
        candidatesBySlot: Record<string, CandidateItem[]>;
        counts: {
            beforeFiltering: Record<string, number>;
            afterFiltering: Record<string, number>;
            afterTopK: Record<string, number>;
            filteredByAvailability: Record<string, number>;
            filteredByRentalDays: Record<string, number>;
            filteredByDistance: Record<string, number>;
        };
        expandedSlots: SlotInput[];
        slotDebug: Record<string, SlotFilterDebug[]>;
    }>;
    private loadSlotListings;
    private primeRatingAggregates;
    private normalizeConstraints;
    private computeDeviationDays;
    private computeDurationDays;
    isSlotImpossible(candidates: CandidateItem[]): boolean;
    findEmptySlot(slots: SlotInput[], candidatesBySlot: Record<string, CandidateItem[]>): SlotInput | undefined;
}
