import { Injectable } from "@nestjs/common";

@Injectable()
export class BundleExplanationService {
  build(input: {
    finalScore: number;
    priceScore: number;
    reliabilityScore: number;
    logisticsScore: number;
    availabilityScore: number;
    productQualityScore: number;
    stabilityScore: number;
    totalPrice: number;
    totalDistanceKm: number;
    pickupPointsCount: number;
    lendersCount: number;
    exactAvailabilityFit: boolean;
    weakDimensions: string[];
  }) {
    const strengths: string[] = [];
    const tradeoffs: string[] = [];
    const chips: string[] = [];

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

    const titleHe =
      input.finalScore >= 8.2
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

  private buildSubtitle(input: {
    totalPrice: number;
    totalDistanceKm: number;
    pickupPointsCount: number;
    exactAvailabilityFit: boolean;
  }) {
    const datePart = input.exactAvailabilityFit ? "התאמה מלאה לתאריכים" : "התאמה חלקית לתאריכים";
    return `₪${input.totalPrice.toFixed(0)}, ${input.pickupPointsCount} נקודות איסוף, ${input.totalDistanceKm.toFixed(
      1,
    )} ק"מ משוער, ${datePart}`;
  }

  private translateTitle(heTitle: string) {
    const mapping: Record<string, string> = {
      "האופציה המאוזנת ביותר": "Most balanced option",
      "האופציה החסכונית": "Best price option",
      "האופציה הנוחה ביותר לאיסוף": "Easiest pickup option",
      "חבילה מומלצת": "Recommended bundle",
    };

    return mapping[heTitle] ?? "Recommended bundle";
  }

  private translateSubtitle(heSubtitle: string) {
    return heSubtitle;
  }
}
