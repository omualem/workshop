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
exports.BeamSearchService = void 0;
const common_1 = require("@nestjs/common");
const bundle_scoring_service_1 = require("./bundle-scoring.service");
let BeamSearchService = class BeamSearchService {
    scoring;
    constructor(scoring) {
        this.scoring = scoring;
    }
    search(slots, candidatesBySlot, budget, prefs, maxPickupPoints) {
        const stats = {
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
        const suffixMinSums = new Array(slots.length + 1).fill(0);
        for (let i = slots.length - 1; i >= 0; i--) {
            suffixMinSums[i] = suffixMinSums[i + 1] + minRemainingPrice[i];
        }
        const pickupCap = Math.min(slots.length, maxPickupPoints ?? slots.length);
        let beam = [
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
            const nextBeam = [];
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
        const bundles = beam.map((entry) => this.materializeBundle(entry.items, entry.totalPrice, entry.uniquePickups));
        stats.finalBundles = bundles.length;
        return { bundles, stats };
    }
    canExtendBundle(partialPrice, remainingMinPriceSum, budget) {
        return partialPrice + remainingMinPriceSum <= budget;
    }
    materializeBundle(items, totalPrice, uniquePickups) {
        const lenders = new Set(items.map((i) => i.lenderId));
        return {
            items,
            totalPrice,
            uniqueLenderCount: lenders.size,
            uniquePickupCount: uniquePickups.size,
        };
    }
};
exports.BeamSearchService = BeamSearchService;
exports.BeamSearchService = BeamSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bundle_scoring_service_1.BundleScoringService])
], BeamSearchService);
//# sourceMappingURL=beam-search.service.js.map