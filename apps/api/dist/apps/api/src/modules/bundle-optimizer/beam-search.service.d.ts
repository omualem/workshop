import { BundleScoringService } from "./bundle-scoring.service";
import type { CandidateItem, OptimizerPreferences, SelectedBundle, SlotInput } from "./bundle-optimizer.types";
export interface BeamSearchStats {
    expanded: number;
    prunedByBudget: number;
    prunedByEarlyBound: number;
    prunedByPickupCap: number;
    prunedByInventory: number;
    beamRetained: number;
    finalBundles: number;
}
export declare class BeamSearchService {
    private readonly scoring;
    constructor(scoring: BundleScoringService);
    search(slots: SlotInput[], candidatesBySlot: Record<string, CandidateItem[]>, budget: number, prefs: OptimizerPreferences, maxPickupPoints?: number): {
        bundles: SelectedBundle[];
        stats: BeamSearchStats;
    };
    canExtendBundle(partialPrice: number, remainingMinPriceSum: number, budget: number): boolean;
    private materializeBundle;
}
