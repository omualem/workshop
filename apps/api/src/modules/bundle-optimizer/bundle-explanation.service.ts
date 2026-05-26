import { Injectable } from "@nestjs/common";
import type { CandidateItem, ScoredBundle } from "./bundle-optimizer.types";

/**
 * Deterministic Hebrew explanation generator for optimizer output.
 */
@Injectable()
export class BundleExplanationService {
  build(scored: ScoredBundle, budget: number) {
    const { metrics, breakdown, bundle, derived } = scored;
    const explanations: string[] = [];
    const tradeoffs: string[] = [];
    const profileExplanation = this.preferenceProfileExplanation(
      breakdown.preferences.profile,
    );

    if (bundle.totalPrice <= budget) {
      explanations.push("החבילה עומדת בתקציב שהוגדר");
    }
    if (profileExplanation) {
      explanations.push(profileExplanation);
    }

    if (metrics.availability >= 9.5) {
      explanations.push("כל הפריטים זמינים בתאריכים שבחרת");
    } else if (metrics.availability < 7) {
      const weakest = this.weakestBy(bundle.items, (i) => i.m_availability);
      tradeoffs.push(
        weakest
          ? `זמינות נמוכה לאחד הפריטים בתאריכים שבחרת: ${weakest.titleHe}`
          : "חלק מהפריטים זמינים בקושי בתאריכים שבחרת",
      );
    }

    if (bundle.uniquePickupCount === 1) {
      explanations.push("נקודת איסוף אחת בלבד");
    } else {
      tradeoffs.push(`האיסוף מתבצע מ-${bundle.uniquePickupCount} נקודות שונות`);
    }

    if (metrics.reliability >= 8) {
      explanations.push("המשכירים בחבילה בעלי דירוג אמינות גבוה");
    } else if (metrics.reliability < 6.5) {
      const weakest = this.weakestBy(bundle.items, (i) => i.m_reliability);
      tradeoffs.push(
        weakest
          ? `אמינות אחד המשכירים נמוכה יחסית (פריט: ${weakest.titleHe})`
          : "דירוג האמינות של המשכירים נמוך מהממוצע",
      );
    }

    const newLender = bundle.items.find(
      (i) =>
        i.lenderCompletedTransactions !== undefined &&
        i.lenderCompletedTransactions < 5,
    );
    if (newLender) {
      tradeoffs.push("בחבילה יש משכיר חדש יחסית עם מעט עסקאות קודמות");
    }

    if (metrics.distance >= 7) {
      explanations.push("מרחק האיסוף קצר יחסית");
    } else if (metrics.distance < 4) {
      tradeoffs.push("החבילה כוללת נקודת איסוף רחוקה יחסית");
    }

    if (
      derived.maxDistance >= 15 &&
      derived.avgDistance > 0 &&
      derived.maxDistance > 1.6 * derived.avgDistance
    ) {
      tradeoffs.push(
        `נקודת איסוף אחת רחוקה במיוחד (${derived.maxDistance.toFixed(1)} ק״מ)`,
      );
    }
    if (derived.deviationDaysSum > 0) {
      tradeoffs.push(`סטיית זמינות מצטברת: ${derived.deviationDaysSum} ימים`);
    }

    if (metrics.price >= 7) {
      explanations.push("המחיר נמוך משמעותית מהתקציב");
    } else if (metrics.price < 4) {
      tradeoffs.push("החבילה קרובה לתקציב המקסימלי");
    }

    const sliders = breakdown.preferences.sliders;
    if (sliders.reliability >= 8 && metrics.reliability < 6.5) {
      tradeoffs.push(
        "למרות שהוגדרה חשיבות גבוהה לאמינות, אחד המשכירים בחבילה קיבל ציון אמינות נמוך יחסית.",
      );
    }
    if (sliders.pickupSimplicity >= 8 && bundle.uniquePickupCount > 1) {
      tradeoffs.push(
        "למרות שהוגדרה חשיבות גבוהה לקלות איסוף, החבילה כוללת יותר מנקודת איסוף אחת.",
      );
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
        availability: round(metrics.availability),
      },
      scoreBreakdown: {
        weightedUtility: round(breakdown.weightedUtility),
        variancePenalty: round(breakdown.variancePenalty),
        bottleneckTerm: round(breakdown.bottleneckTerm),
        pickupPenalty: round(breakdown.pickupPenalty),
        maxDistancePenalty: round(breakdown.maxDistancePenalty),
        lowScorePenalty: round(breakdown.lowScorePenalty),
        rawFinalScore: round(breakdown.rawFinalScore),
        finalScore: round(breakdown.finalScore),
        preferences: {
          profile: breakdown.preferences.profile,
          baseProfile: breakdown.preferences.baseProfile,
          sliders: breakdown.preferences.sliders,
          normalizedWeights: roundRecord(breakdown.preferences.normalizedWeights),
          penaltyMultipliers: {
            pickup: round(breakdown.preferences.penaltyMultipliers.pickup),
            lowScore: roundRecord(
              breakdown.preferences.penaltyMultipliers.lowScore,
            ),
            maxDistance: round(
              breakdown.preferences.penaltyMultipliers.maxDistance,
            ),
            variance: round(breakdown.preferences.penaltyMultipliers.variance),
            bottleneck: round(
              breakdown.preferences.penaltyMultipliers.bottleneck,
            ),
          },
        },
      },
      lowScorePenaltyBreakdown: {
        price: round(breakdown.lowScorePenaltyBreakdown.price),
        distance: round(breakdown.lowScorePenaltyBreakdown.distance),
        reliability: round(breakdown.lowScorePenaltyBreakdown.reliability),
        availability: round(breakdown.lowScorePenaltyBreakdown.availability),
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
        price: round(item.price),
        distanceKm: round(item.distanceKm),
        attributes: item.attributeValues,
      })),
    };
  }

  private weakestBy(
    items: CandidateItem[],
    selector: (item: CandidateItem) => number,
  ): CandidateItem | undefined {
    if (items.length === 0) return undefined;
    let weakest = items[0];
    let weakestValue = selector(weakest);
    for (let i = 1; i < items.length; i++) {
      const value = selector(items[i]);
      if (value < weakestValue) {
        weakest = items[i];
        weakestValue = value;
      }
    }
    return weakest;
  }

  private pickLabel(scored: ScoredBundle): string {
    const { metrics, breakdown, bundle } = scored;
    if (metrics.price >= 8 && breakdown.finalScore >= 7) return "החבילה המשתלמת ביותר";
    if (bundle.uniquePickupCount === 1) return "החבילה הנוחה ביותר לאיסוף";
    if (metrics.reliability >= 8.5) return "החבילה האמינה ביותר";
    if (breakdown.variancePenalty < 0.4) return "החבילה המאוזנת ביותר";
    return "חבילה מומלצת";
  }

  private preferenceProfileExplanation(profile: string): string | null {
    switch (profile) {
      case "cheapest":
        return "המערכת נתנה עדיפות גבוהה למחיר ולכן חבילות זולות קיבלו יתרון.";
      case "minimalEffort":
        return "המערכת נתנה עדיפות לאיסוף פשוט ולכן חבילות עם פחות נקודות איסוף קיבלו יתרון.";
      case "professional":
        return "המערכת נתנה עדיפות לאמינות ולזמינות בגלל פרופיל הפקה מקצועית.";
      case "custom":
        return "הדירוג חושב לפי המשקלים שהוגדרו ידנית.";
      default:
        return null;
    }
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundRecord<T extends Record<string, number>>(record: T): T {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, round(value)]),
  ) as T;
}
