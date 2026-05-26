import { Injectable } from "@nestjs/common";
import type { ScoredBundle } from "./bundle-optimizer.types";

/**
 * Pareto dominance filter (multi-objective optimization).
 *
 * Bundle A dominates B iff A is at least as strong on price, distance,
 * reliability, and availability, and strictly stronger on at least one.
 */
@Injectable()
export class ParetoFilterService {
  filter(bundles: ScoredBundle[]): { kept: ScoredBundle[]; removedCount: number } {
    const kept: ScoredBundle[] = [];

    for (const candidate of bundles) {
      const dominated = bundles.some(
        (other) => other !== candidate && this.dominates(other, candidate),
      );
      if (!dominated) kept.push(candidate);
    }

    return { kept, removedCount: bundles.length - kept.length };
  }

  dominates(a: ScoredBundle, b: ScoredBundle): boolean {
    const dims: Array<keyof typeof a.metrics> = [
      "price",
      "distance",
      "reliability",
      "availability",
    ];
    let strictlyBetter = false;
    for (const j of dims) {
      const va = a.metrics[j];
      const vb = b.metrics[j];
      if (va < vb) return false;
      if (va > vb) strictlyBetter = true;
    }
    return strictlyBetter;
  }
}
