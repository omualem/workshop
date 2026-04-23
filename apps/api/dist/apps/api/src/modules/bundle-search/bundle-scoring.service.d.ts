import type { BundleSearchInput, RankingWeights } from "@rental/types";
import type { GeneratedBundle } from "./bundle-search.types";
export declare class BundleScoringService {
    scoreBundle(bundle: GeneratedBundle, allBundles: GeneratedBundle[], input: BundleSearchInput, weights: RankingWeights): {
        finalScore: number;
        priceScore: number;
        reliabilityScore: number;
        logisticsScore: number;
        availabilityScore: number;
        productQualityScore: number;
        stabilityScore: number;
        stability: import("@rental/scoring").StabilityComputation;
    };
    private median;
    private clamp;
}
