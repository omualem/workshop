"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleExplanationService = void 0;
const common_1 = require("@nestjs/common");
let BundleExplanationService = class BundleExplanationService {
    build(scored, budget) {
        const { metrics, breakdown, bundle, derived } = scored;
        const explanations = [];
        const tradeoffs = [];
        if (bundle.totalPrice <= budget) {
            explanations.push("החבילה עומדת בתקציב שהוגדר");
        }
        if (metrics.availability >= 9.5) {
            explanations.push("כל הפריטים זמינים בתאריכים שבחרת");
        }
        else if (metrics.availability < 6) {
            tradeoffs.push("חלק מהפריטים זמינים בקושי בתאריכים שבחרת");
        }
        if (bundle.uniquePickupCount === 1) {
            explanations.push("נקודת איסוף אחת בלבד");
        }
        else {
            tradeoffs.push(`האיסוף מתבצע מ-${bundle.uniquePickupCount} נקודות שונות`);
        }
        if (metrics.reliability >= 8) {
            explanations.push("המשכירים בחבילה בעלי דירוג גבוה");
        }
        else if (metrics.reliability < 6) {
            tradeoffs.push("דירוג האמינות של המשכירים נמוך מהממוצע");
        }
        if (metrics.condition >= 8) {
            explanations.push("מצב המוצרים בחבילה גבוה");
        }
        else if (metrics.condition < 6) {
            tradeoffs.push("חלק מהפריטים במצב פחות טוב");
        }
        if (metrics.distance >= 7) {
            explanations.push("מרחק האיסוף קצר יחסית");
        }
        else if (metrics.distance < 4) {
            tradeoffs.push("מרחק האיסוף גדול יחסית");
        }
        if (derived.maxDistance >= 15 && derived.avgDistance > 0 && derived.maxDistance > 1.6 * derived.avgDistance) {
            tradeoffs.push(`נקודת איסוף אחת רחוקה במיוחד (${derived.maxDistance.toFixed(1)} ק״מ)`);
        }
        if (derived.deviationDaysSum > 0) {
            tradeoffs.push(`סטיית זמינות מצטברת: ${derived.deviationDaysSum} ימים`);
        }
        if (metrics.price >= 7) {
            explanations.push("המחיר נמוך משמעותית מהתקציב");
        }
        else if (metrics.price < 4) {
            tradeoffs.push("המחיר אינו הנמוך ביותר, אך החבילה מאוזנת יותר");
        }
        return {
            label: this.pickLabel(scored),
            score: round(breakdown.finalScore),
            totalPrice: round(bundle.totalPrice),
            budget,
            pickupPointCount: bundle.uniquePickupCount,
            metrics: {
                price: round(metrics.price),
                distance: round(metrics.distance),
                reliability: round(metrics.reliability),
                condition: round(metrics.condition),
                availability: round(metrics.availability),
            },
            scoreBreakdown: {
                weightedUtility: round(breakdown.weightedUtility),
                variancePenalty: round(breakdown.variancePenalty),
                bottleneckTerm: round(breakdown.bottleneckTerm),
                pickupPenalty: round(breakdown.pickupPenalty),
                maxDistancePenalty: round(breakdown.maxDistancePenalty),
                finalScore: round(breakdown.finalScore),
            },
            derived: {
                avgDistance: round(derived.avgDistance),
                maxDistance: round(derived.maxDistance),
                pickupCost: round(derived.pickupCost),
                pickupStops: derived.pickupStops,
                deviationDaysSum: derived.deviationDaysSum,
            },
            penalties: {
                variance: round(breakdown.variancePenalty),
                pickup: round(breakdown.pickupPenalty),
                distanceMaxPenalty: round(breakdown.maxDistancePenalty),
            },
            explanations,
            tradeoffs,
            includedItems: bundle.items.map((item) => ({
                slotKey: item.slotKey,
                listingId: item.listingId,
                lenderId: item.lenderId,
                titleHe: item.titleHe,
                titleEn: item.titleEn,
                condition: item.condition,
                price: round(item.price),
                distanceKm: round(item.distanceKm),
                attributes: item.attributeValues,
            })),
        };
    }
    pickLabel(scored) {
        const { metrics, breakdown, bundle } = scored;
        if (metrics.price >= 8 && breakdown.finalScore >= 7)
            return "החבילה המשתלמת ביותר";
        if (bundle.uniquePickupCount === 1)
            return "החבילה הנוחה ביותר לאיסוף";
        if (metrics.reliability >= 8.5)
            return "החבילה האמינה ביותר";
        if (breakdown.variancePenalty < 0.4)
            return "החבילה המאוזנת ביותר";
        return "חבילה מומלצת";
    }
};
exports.BundleExplanationService = BundleExplanationService;
exports.BundleExplanationService = BundleExplanationService = __decorate([
    (0, common_1.Injectable)()
], BundleExplanationService);
function round(n) {
    return Math.round(n * 100) / 100;
}
//# sourceMappingURL=bundle-explanation.service.js.map