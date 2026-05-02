"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleOptimizerService = void 0;
const common_1 = require("@nestjs/common");
const beam_search_service_1 = require("./beam-search.service");
const bundle_explanation_service_1 = require("./bundle-explanation.service");
const bundle_scoring_service_1 = require("./bundle-scoring.service");
const candidate_filter_service_1 = require("./candidate-filter.service");
const pareto_filter_service_1 = require("./pareto-filter.service");
let BundleOptimizerService = class BundleOptimizerService {
    candidateFilter;
    beamSearch;
    scoring;
    pareto;
    explanation;
    constructor(candidateFilter, beamSearch, scoring, pareto, explanation) {
        this.candidateFilter = candidateFilter;
        this.beamSearch = beamSearch;
        this.scoring = scoring;
        this.pareto = pareto;
        this.explanation = explanation;
    }
    async optimize(request) {
        const { candidatesBySlot, counts, expandedSlots, slotDebug } = await this.candidateFilter.buildCandidatesPerSlot(request);
        const includeDebug = process.env.NODE_ENV !== "production";
        const emptySlot = this.candidateFilter.findEmptySlot(expandedSlots, candidatesBySlot);
        if (emptySlot) {
            const userSlotKey = emptySlot.slotKey.split("::")[0];
            return this.emptyResult(request, counts, userSlotKey);
        }
        const { bundles: completeBundles, stats } = this.beamSearch.search(expandedSlots, candidatesBySlot, request.budget, request.preferences, request.maxPickupPoints);
        if (completeBundles.length === 0) {
            return this.emptyResult(request, counts, null);
        }
        const allScored = completeBundles.map((bundle) => this.scoring.calculateFinalScore(bundle, request.preferences, request.budget));
        const { kept: paretoKept, removedCount: paretoRemoved } = this.pareto.filter(allScored);
        const finalScored = paretoKept
            .sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore)
            .slice(0, 10);
        const bundles = finalScored.map((s) => this.explanation.build(s, request.budget));
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
                    preferences: request.preferences,
                },
                algorithm: {
                    name: "Budget-Constrained Multi-Objective Bundle Optimization",
                    method: "Top-K Candidate Pruning + Branch-and-Bound Beam Search + Pareto Frontier + Bottleneck-Aware Scoring",
                    complexity: "O(n * w * k)",
                    formula: "Score(x) = sum_j w_j*M_j(x) - lambda*Var(M(x)) + alpha*min_j M_j(x) - beta*P_u(x) - gamma*D_max(x)",
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
    emptyResult(request, counts, blockedSlotKey) {
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
            suggestions.unshift(`לא נמצאו פריטים זמינים עבור הסלוט: ${blockedSlotKey}`);
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
};
exports.BundleOptimizerService = BundleOptimizerService;
exports.BundleOptimizerService = BundleOptimizerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [candidate_filter_service_1.CandidateFilterService,
        beam_search_service_1.BeamSearchService,
        bundle_scoring_service_1.BundleScoringService,
        pareto_filter_service_1.ParetoFilterService,
        bundle_explanation_service_1.BundleExplanationService])
], BundleOptimizerService);
function sumValues(record) {
    return Object.values(record).reduce((s, v) => s + v, 0);
}
//# sourceMappingURL=bundle-optimizer.service.js.map