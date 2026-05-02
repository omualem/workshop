import { Injectable } from "@nestjs/common";
import { BundleScoringService } from "./bundle-scoring.service";
import type {
  CandidateItem,
  OptimizerPreferences,
  SelectedBundle,
  SlotInput,
} from "./bundle-optimizer.types";

/** Search-space telemetry returned alongside the result list. */
export interface BeamSearchStats {
  expanded: number;
  prunedByBudget: number;
  prunedByEarlyBound: number;
  prunedByPickupCap: number;
  prunedByInventory: number;
  beamRetained: number;
  finalBundles: number;
}

@Injectable()
export class BeamSearchService {
  constructor(private readonly scoring: BundleScoringService) {}

  search(
    slots: SlotInput[],
    candidatesBySlot: Record<string, CandidateItem[]>,
    budget: number,
    prefs: OptimizerPreferences,
    maxPickupPoints?: number,
  ): { bundles: SelectedBundle[]; stats: BeamSearchStats } {
    const stats: BeamSearchStats = {
      expanded: 0,
      prunedByBudget: 0,
      prunedByEarlyBound: 0,
      prunedByPickupCap: 0,
      prunedByInventory: 0,
      beamRetained: 0,
      finalBundles: 0,
    };

    const minRemainingPrice = slots.map((s) => {
      const pool = candidatesBySlot[s.slotKey] ?? [];
      return pool.length === 0 ? Infinity : Math.min(...pool.map((c) => c.price));
    });
    const suffixMinSums: number[] = new Array(slots.length + 1).fill(0);
    for (let i = slots.length - 1; i >= 0; i--) {
      suffixMinSums[i] = suffixMinSums[i + 1] + minRemainingPrice[i];
    }

    const pickupCap = Math.min(slots.length, maxPickupPoints ?? slots.length);

    let beam: Array<{
      items: CandidateItem[];
      totalPrice: number;
      partialScore: number;
      uniquePickups: Set<string>;
      listingCounts: Map<string, number>;
    }> = [
      {
        items: [],
        totalPrice: 0,
        partialScore: 0,
        uniquePickups: new Set(),
        listingCounts: new Map(),
      },
    ];

    for (let layer = 0; layer < slots.length; layer++) {
      const slot = slots[layer];
      const slotCandidates = candidatesBySlot[slot.slotKey] ?? [];
      if (slotCandidates.length === 0) {
        return { bundles: [], stats };
      }

      const remainingAfterThis = suffixMinSums[layer + 1];
      const nextBeam: typeof beam = [];

      for (const partial of beam) {
        for (const candidate of slotCandidates) {
          stats.expanded++;
          const extendedTotal = partial.totalPrice + candidate.price;

          if (extendedTotal > budget) {
            stats.prunedByBudget++;
            continue;
          }

          if (extendedTotal + remainingAfterThis > budget) {
            stats.prunedByEarlyBound++;
            continue;
          }

          const nextPickups = new Set(partial.uniquePickups);
          nextPickups.add(candidate.pickupKey);
          if (nextPickups.size > pickupCap) {
            stats.prunedByPickupCap++;
            continue;
          }

          const usedCount = partial.listingCounts.get(candidate.listingId) ?? 0;
          if (usedCount >= candidate.inventoryCount) {
            stats.prunedByInventory++;
            continue;
          }
          const nextListingCounts = new Map(partial.listingCounts);
          nextListingCounts.set(candidate.listingId, usedCount + 1);

          const extendedItems = [...partial.items, candidate];
          nextBeam.push({
            items: extendedItems,
            totalPrice: extendedTotal,
            partialScore: this.scoring.partialScore(extendedItems, prefs, budget),
            uniquePickups: nextPickups,
            listingCounts: nextListingCounts,
          });
        }
      }

      nextBeam.sort((a, b) => b.partialScore - a.partialScore);
      beam = nextBeam.slice(0, prefs.beamWidth);
      stats.beamRetained += beam.length;

      if (beam.length === 0) {
        return { bundles: [], stats };
      }
    }

    const bundles = beam.map((entry) =>
      this.materializeBundle(entry.items, entry.totalPrice, entry.uniquePickups),
    );
    stats.finalBundles = bundles.length;
    return { bundles, stats };
  }

  canExtendBundle(
    partialPrice: number,
    remainingMinPriceSum: number,
    budget: number,
  ): boolean {
    return partialPrice + remainingMinPriceSum <= budget;
  }

  private materializeBundle(
    items: CandidateItem[],
    totalPrice: number,
    uniquePickups: Set<string>,
  ): SelectedBundle {
    const lenders = new Set(items.map((i) => i.lenderId));
    return {
      items,
      totalPrice,
      uniqueLenderCount: lenders.size,
      uniquePickupCount: uniquePickups.size,
    };
  }
}
