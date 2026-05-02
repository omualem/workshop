import type { ScoredBundle } from "./bundle-optimizer.types";
export declare class ParetoFilterService {
    filter(bundles: ScoredBundle[]): {
        kept: ScoredBundle[];
        removedCount: number;
    };
    dominates(a: ScoredBundle, b: ScoredBundle): boolean;
}
