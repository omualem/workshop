import { Injectable } from "@nestjs/common";
import type { ScoredBundle } from "./bundle-optimizer.types";

/**
 * Pareto dominance filter (multi-objective optimization).
 *
 * Bundle A DOMINATES B iff:
 *   ∀ j ∈ {price, distance, reliability, condition, availability}:
 *        M_j(A) ≥ M_j(B)
 *   ∧ ∃ j: M_j(A) > M_j(B)
 *
 * The Pareto frontier is the set of non-dominated bundles. Removing
 * dominated bundles before final ranking keeps only solutions that are
 * "interesting trade-offs" — every kept bundle is best-in-class on at
 * least one dimension, so any stakeholder priority is represented.
 *
 *   F(X) = { x ∈ X : ¬∃ y ∈ X with y ≻ x }      (Pareto frontier)
 */
@Injectable()
export class ParetoFilterService {
  filter(bundles: ScoredBundle[]): { kept: ScoredBundle[]; removedCount: number } {
    const kept: ScoredBundle[] = [];

    for (const candidate of bundles) {
      const dominated = bundles.some((other) => other !== candidate && this.dominates(other, candidate));
      if (!dominated) kept.push(candidate);
    }

    return { kept, removedCount: bundles.length - kept.length };
  }

  /** A ≻ B (A dominates B). Strictly stronger or equal on all 5 metrics. */
  dominates(a: ScoredBundle, b: ScoredBundle): boolean {
    const dims: Array<keyof typeof a.metrics> = [
      "price",
      "distance",
      "reliability",
      "condition",
      "availability",
    ];
    let strictlyBetter = false;
    for (const j of dims) {
      const va = a.metrics[j];
      const vb = b.metrics[j];
      if (va < vb) return false;        // A is worse on dimension j → no domination
      if (va > vb) strictlyBetter = true;
    }
    return strictlyBetter;
  }
}
