import { Injectable } from "@nestjs/common";
import { AddressesService } from "../addresses/addresses.service";
import { BeamSearchService } from "./beam-search.service";
import { BundleExplanationService } from "./bundle-explanation.service";
import { BundleScoringService } from "./bundle-scoring.service";
import { CandidateFilterService } from "./candidate-filter.service";
import { ParetoFilterService } from "./pareto-filter.service";
import { PreferenceMappingService } from "./preference-mapping.service";
import type { OptimizerRequest } from "./bundle-optimizer.types";

@Injectable()
export class BundleOptimizerService {
  constructor(
    private readonly candidateFilter: CandidateFilterService,
    private readonly beamSearch: BeamSearchService,
    private readonly scoring: BundleScoringService,
    private readonly pareto: ParetoFilterService,
    private readonly explanation: BundleExplanationService,
    private readonly addresses: AddressesService,
    private readonly preferenceMapping: PreferenceMappingService,
  ) {}

  async optimize(request: OptimizerRequest) {
    request = await this.resolveRenterLocation(request);
    const resolvedPreferences =
      this.preferenceMapping.resolvePreferences(request);
    request = {
      ...request,
      preferenceProfile: resolvedPreferences.profile,
      basePreferenceProfile: resolvedPreferences.baseProfile,
      preferenceSliders: resolvedPreferences.sliders,
      preferences: {
        ...request.preferences,
        weights: resolvedPreferences.weights,
      },
    };

    const { candidatesBySlot, counts, expandedSlots, slotDebug } =
      await this.candidateFilter.buildCandidatesPerSlot(request);
    const includeDebug = process.env.NODE_ENV !== "production";

    const emptySlot = this.candidateFilter.findEmptySlot(
      expandedSlots,
      candidatesBySlot,
    );
    if (emptySlot) {
      const userSlotKey = emptySlot.slotKey.split("::")[0];
      return this.emptyResult(request, counts, userSlotKey);
    }

    const { bundles: completeBundles, stats } = this.beamSearch.search(
      expandedSlots,
      candidatesBySlot,
      request.budget,
      request.preferences,
      request.maxPickupPoints,
    );

    if (completeBundles.length === 0) {
      return this.emptyResult(request, counts, null);
    }

    const allScored = completeBundles.map((bundle) =>
      this.scoring.calculateFinalScore(
        bundle,
        request.preferences,
        request.budget,
        resolvedPreferences,
      ),
    );

    const { kept: paretoKept, removedCount: paretoRemoved } =
      this.pareto.filter(allScored);

    const finalScored = paretoKept
      .sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore)
      .slice(0, 10);

    const bundles = finalScored.map((s) =>
      this.explanation.build(s, request.budget),
    );

    const initialSpaceEstimate = request.slots
      .map((s) => counts.afterTopK[s.slotKey] ?? 0)
      .reduce((acc, v) => acc * Math.max(1, v), 1);

    return {
      success: true,
      data: {
        requestSummary: {
          slots: request.slots,
          dateRange: request.dateRange,
          budget: request.budget,
          maxPickupPoints: request.maxPickupPoints,
          userLocation: request.userLocation,
          preferenceProfile: request.preferenceProfile,
          basePreferenceProfile: request.basePreferenceProfile,
          preferenceSliders: request.preferenceSliders,
          preferences: request.preferences,
        },
        algorithm: {
          name: "Budget-Constrained Multi-Objective Bundle Optimization",
          method:
            "Top-K Candidate Pruning + Branch-and-Bound Beam Search + Pareto Frontier + Bottleneck-Aware Scoring",
          complexity: "O(n * w * k)",
          formula:
            "Score(x) = sum_j w_j*M_j(x) - lambda*Var(M(x)) + alpha*min_j M_j(x) - beta*P_u(x) - gamma*D_max(x)",
        },
        bundles,
        ...(includeDebug
          ? {
              debug: {
                slotsCount: request.slots.length,
                topKPerSlot: request.preferences.topKPerSlot,
                beamWidth: request.preferences.beamWidth,
                maxPickupPoints: request.maxPickupPoints,
                candidateCountsBeforeFiltering: counts.beforeFiltering,
                candidateCountsAfterFiltering: counts.afterFiltering,
                candidateCountsAfterTopK: counts.afterTopK,
                filteredByAvailability: counts.filteredByAvailability,
                filteredByRentalDays: counts.filteredByRentalDays,
                filteredByDistance: counts.filteredByDistance,
                distance: slotDebug,
                availability: slotDebug,
                searchSpace: {
                  initial: "k^n",
                  initialEstimate: initialSpaceEstimate,
                  afterFiltering: sumValues(counts.afterFiltering),
                  afterTopK: sumValues(counts.afterTopK),
                  afterBeam: stats.finalBundles,
                  afterPareto: paretoKept.length,
                },
                beamStats: {
                  expanded: stats.expanded,
                  prunedByBudget: stats.prunedByBudget,
                  prunedByEarlyBound: stats.prunedByEarlyBound,
                  prunedByPickupCap: stats.prunedByPickupCap,
                  prunedByInventory: stats.prunedByInventory,
                  beamRetained: stats.beamRetained,
                },
                paretoRemoved,
              },
            }
          : {}),
      },
    };
  }

  private emptyResult(
    request: OptimizerRequest,
    counts: {
      beforeFiltering: Record<string, number>;
      afterFiltering: Record<string, number>;
      afterTopK: Record<string, number>;
      filteredByAvailability: Record<string, number>;
      filteredByRentalDays: Record<string, number>;
      filteredByDistance: Record<string, number>;
    },
    blockedSlotKey: string | null,
  ) {
    const includeDebug = process.env.NODE_ENV !== "production";
    const suggestions = [
      "נסה להגדיל את התקציב",
      "נסה לבחור טווח תאריכים אחר",
      "נסה להרחיב את אזור האיסוף",
    ];
    if (request.maxPickupPoints !== undefined) {
      suggestions.push("נסה להגדיל את מספר נקודות האיסוף המותר");
    }
    if (blockedSlotKey) {
      suggestions.unshift(
        `לא נמצאו פריטים זמינים עבור הסלוט: ${blockedSlotKey}`,
      );
    }

    return {
      success: true,
      data: {
        requestSummary: {
          slots: request.slots,
          dateRange: request.dateRange,
          budget: request.budget,
          maxPickupPoints: request.maxPickupPoints,
          userLocation: request.userLocation,
          preferenceProfile: request.preferenceProfile,
          basePreferenceProfile: request.basePreferenceProfile,
          preferenceSliders: request.preferenceSliders,
          preferences: request.preferences,
        },
        bundles: [],
        messageHe: "לא נמצאה חבילה שעומדת בכל האילוצים",
        suggestions,
        ...(includeDebug
          ? {
              debug: {
                slotsCount: request.slots.length,
                topKPerSlot: request.preferences.topKPerSlot,
                beamWidth: request.preferences.beamWidth,
                maxPickupPoints: request.maxPickupPoints,
                candidateCountsBeforeFiltering: counts.beforeFiltering,
                candidateCountsAfterFiltering: counts.afterFiltering,
                candidateCountsAfterTopK: counts.afterTopK,
                filteredByAvailability: counts.filteredByAvailability,
                filteredByRentalDays: counts.filteredByRentalDays,
                filteredByDistance: counts.filteredByDistance,
                distance: {},
                availability: {},
                searchSpace: {
                  initial: "k^n",
                  afterFiltering: sumValues(counts.afterFiltering),
                  afterTopK: sumValues(counts.afterTopK),
                  afterBeam: 0,
                  afterPareto: 0,
                },
              },
            }
          : {}),
      },
    };
  }

  /**
   * Renter location may arrive as either explicit lat/lng (legacy clients,
   * tests) or as a city/street/addressNumber selector (the address-import
   * flow). Resolve once here, before the search runs — never inside the
   * scoring loop, since geocoding is rate-limited.
   */
  private async resolveRenterLocation(
    request: OptimizerRequest,
  ): Promise<OptimizerRequest> {
    const loc = request.userLocation;
    if (loc.lat !== undefined && loc.lng !== undefined) {
      return request;
    }
    if (
      loc.cityId === undefined ||
      loc.streetId === undefined ||
      loc.addressNumber === undefined
    ) {
      return request;
    }
    const resolved = await this.addresses.geocodeRenterAddress({
      cityId: loc.cityId,
      streetId: loc.streetId,
      addressNumber: loc.addressNumber,
    });
    return {
      ...request,
      userLocation: {
        ...loc,
        lat: resolved.lat,
        lng: resolved.lng,
        address: loc.address ?? resolved.addressText,
      },
    };
  }
}

function sumValues(record: Record<string, number>): number {
  return Object.values(record).reduce((s, v) => s + v, 0);
}
