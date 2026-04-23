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
    build(input) {
        const strengths = [];
        const tradeoffs = [];
        const chips = [];
        if (input.lendersCount === 1) {
            strengths.push("כל הפריטים ממלווה אחד");
            chips.push("same lender");
        }
        if (input.pickupPointsCount <= 2) {
            strengths.push(`${input.pickupPointsCount} נקודות איסוף בלבד`);
            chips.push("2 pickup points only");
        }
        if (input.exactAvailabilityFit) {
            strengths.push("התאמה מלאה לתאריכים");
            chips.push("exact date match");
        }
        if (input.priceScore >= 7.5) {
            strengths.push("יחס מחיר טוב מול השוק");
            chips.push("budget-friendly");
        }
        if (input.reliabilityScore >= 7.5) {
            strengths.push("מלווים עם אמינות גבוהה");
            chips.push("highly rated lenders");
        }
        if (input.weakDimensions.includes("logistics")) {
            tradeoffs.push("נוחות האיסוף נמוכה יחסית");
        }
        if (input.weakDimensions.includes("price")) {
            tradeoffs.push("המחיר אינו מהזולים בתוצאות");
        }
        if (input.weakDimensions.includes("availability")) {
            tradeoffs.push("הזמינות עדינה ורגישה לשינויים");
        }
        if (input.stabilityScore >= 7.5 && input.weakDimensions.length === 0) {
            strengths.push("ביצועים מאוזנים לאורך כל המדדים");
        }
        const titleHe = input.finalScore >= 8.2
            ? "האופציה המאוזנת ביותר"
            : input.priceScore >= 8.3
                ? "האופציה החסכונית"
                : input.logisticsScore >= 8.3
                    ? "האופציה הנוחה ביותר לאיסוף"
                    : "חבילה מומלצת";
        const subtitleHe = this.buildSubtitle(input);
        return {
            he: {
                title: titleHe,
                subtitle: subtitleHe,
                strengths,
                tradeoffs,
            },
            en: {
                title: this.translateTitle(titleHe),
                subtitle: this.translateSubtitle(subtitleHe),
            },
            chips,
            debugLabels: [
                ...input.weakDimensions.map((dimension) => `penalized:${dimension}`),
                input.weakDimensions.length === 0 ? "boosted:consistent-strong-bundle" : null,
            ].filter(Boolean),
        };
    }
    buildSubtitle(input) {
        const datePart = input.exactAvailabilityFit ? "התאמה מלאה לתאריכים" : "התאמה חלקית לתאריכים";
        return `₪${input.totalPrice.toFixed(0)}, ${input.pickupPointsCount} נקודות איסוף, ${input.totalDistanceKm.toFixed(1)} ק"מ משוער, ${datePart}`;
    }
    translateTitle(heTitle) {
        const mapping = {
            "האופציה המאוזנת ביותר": "Most balanced option",
            "האופציה החסכונית": "Best price option",
            "האופציה הנוחה ביותר לאיסוף": "Easiest pickup option",
            "חבילה מומלצת": "Recommended bundle",
        };
        return mapping[heTitle] ?? "Recommended bundle";
    }
    translateSubtitle(heSubtitle) {
        return heSubtitle;
    }
};
exports.BundleExplanationService = BundleExplanationService;
exports.BundleExplanationService = BundleExplanationService = __decorate([
    (0, common_1.Injectable)()
], BundleExplanationService);
//# sourceMappingURL=bundle-explanation.service.js.map