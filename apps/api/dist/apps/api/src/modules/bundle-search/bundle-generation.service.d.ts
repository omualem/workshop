import type { BundleSearchInput } from "@rental/types";
import { PrismaService } from "../../prisma/prisma.service";
import { AvailabilityService } from "../availability/availability.service";
import { PricingService } from "../pricing/pricing.service";
import { LenderReliabilityService } from "./lender-reliability.service";
import type { GeneratedBundle, SlotCandidate } from "./bundle-search.types";
export declare class BundleGenerationService {
    private readonly prisma;
    private readonly availabilityService;
    private readonly pricingService;
    private readonly lenderReliabilityService;
    constructor(prisma: PrismaService, availabilityService: AvailabilityService, pricingService: PricingService, lenderReliabilityService: LenderReliabilityService);
    findCandidatesPerSlot(input: BundleSearchInput): Promise<{
        result: Record<string, SlotCandidate[]>;
        counts: Record<string, {
            beforePruning: number;
            afterPruning: number;
        }>;
    }>;
    generateBundles(input: BundleSearchInput, slotCandidates: Record<string, SlotCandidate[]>): GeneratedBundle[];
    private fetchListingsForSlot;
    private pruneCandidates;
    private computeListingQualityScore;
}
