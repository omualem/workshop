import { Injectable } from "@nestjs/common";
import type { CandidateItem, ScoredBundle } from "./bundle-optimizer.types";

/**
 * Hebrew explanation generator.
 *
 * Reads the score breakdown and bundle metrics and produces:
 *   • a `label` (which "personality" the bundle has)
 *   • bullet `explanations` — what the bundle does well
 *   • bullet `tradeoffs`    — what it sacrifices
 *
 * No model is used here; explanations are deterministic functions of
 * the score components, so reviewers can audit them.
 */
@Injectable()
export class BundleExplanationService {
  build(scored: ScoredBundle, budget: number) {
    const { metrics, breakdown, bundle, derived } = scored;
    const explanations: string[] = [];
    const tradeoffs: string[] = [];

    if (bundle.totalPrice <= budget) {
      explanations.push("החבילה עומדת בתקציב שהוגדר");
    }

    if (metrics.availability >= 9.5) {
      explanations.push("כל הפריטים זמינים בתאריכים שבחרת");
    } else if (metrics.availability < 7) {
      const weakest = this.weakestBy(bundle.items, (i) => i.m_availability);
      if (weakest) {
        tradeoffs.push(
          `זמינות נמוכה לאחד הפריטים בתאריכים שבחרת: ${weakest.titleHe}`,
        );
      } else {
        tradeoffs.push("חלק מהפריטים זמינים בקושי בתאריכים שבחרת");
      }
    }

    if (bundle.uniquePickupCount === 1) {
      explanations.push("נקודת איסוף אחת בלבד");
    } else {
      tradeoffs.push(`האיסוף מתבצע מ-${bundle.uniquePickupCount} נקודות שונות`);
    }

    if (metrics.reliability >= 8) {
      explanations.push("המשכירים בחבילה בעלי דירוג גבוה");
    } else if (metrics.reliability < 6.5) {
      const weakest = this.weakestBy(bundle.items, (i) => i.m_reliability);
      if (weakest) {
        tradeoffs.push(
          `אמינות אחד המשכירים נמוכה יחסית (פריט: ${weakest.titleHe})`,
        );
      } else {
        tradeoffs.push("דירוג האמינות של המשכירים נמוך מהממוצע");
      }
    }

    // New-lender warning: separate from low-rating warning. A lender can
    // have a high rating but still be unproven (few completed transactions).
    const newLender = bundle.items.find(
      (i) =>
        i.lenderCompletedTransactions !== undefined &&
        i.lenderCompletedTransactions < 5,
    );
    if (newLender) {
      tradeoffs.push("בחבילה יש משכיר חדש יחסית עם מעט עסקאות קודמות");
    }

    if (metrics.condition >= 8) {
      explanations.push("מצב המוצרים בחבילה גבוה");
    } else if (metrics.condition < 6.5) {
      const weakest = this.weakestBy(bundle.items, (i) => i.m_condition);
      if (weakest && weakest.m_condition < 6.5) {
        tradeoffs.push(
          `אחד הפריטים בחבילה במצב נמוך יחסית: ${weakest.titleHe}`,
        );
      } else {
        tradeoffs.push("מצב אחד הפריטים מוריד את ציון החבילה");
      }
    }

    if (metrics.distance >= 7) {
      explanations.push("מרחק האיסוף קצר יחסית");
    } else if (metrics.distance < 4) {
      tradeoffs.push("החבילה כוללת נקודת איסוף רחוקה יחסית");
    }

    // Surface a max-distance outlier when one pickup is much further than
    // the rest (worst is more than 1.6× the average, and ≥ 15 km).
    if (derived.maxDistance >= 15 && derived.avgDistance > 0 && derived.maxDistance > 1.6 * derived.avgDistance) {
      tradeoffs.push(`נקודת איסוף אחת רחוקה במיוחד (${derived.maxDistance.toFixed(1)} ק״מ)`);
    }
    if (derived.deviationDaysSum > 0) {
      tradeoffs.push(`סטיית זמינות מצטברת: ${derived.deviationDaysSum} ימים`);
    }

    if (metrics.price >= 7) {
      explanations.push("המחיר נמוך משמעותית מהתקציב");
    } else if (metrics.price < 4) {
      tradeoffs.push("החבילה קרובה לתקציב המקסימלי");
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
        lowScorePenalty: round(breakdown.lowScorePenalty),
        rawFinalScore: round(breakdown.rawFinalScore),
        finalScore: round(breakdown.finalScore),
      },
      lowScorePenaltyBreakdown: {
        price: round(breakdown.lowScorePenaltyBreakdown.price),
        distance: round(breakdown.lowScorePenaltyBreakdown.distance),
        reliability: round(breakdown.lowScorePenaltyBreakdown.reliability),
        condition: round(breakdown.lowScorePenaltyBreakdown.condition),
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
        condition: item.condition,
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
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
