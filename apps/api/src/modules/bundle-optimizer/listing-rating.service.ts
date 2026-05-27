import { Injectable } from "@nestjs/common";

/**
 * Item-level rating confidence model.
 *
 *   c_i = min(1, v_i / K)
 *   g_hat_i = g_i * c_i + μ * (1 - c_i)
 *   itemRatingScore_i = 2 * g_hat_i
 *
 * where
 *   v_i  = number of DISTINCT users who rated the listing
 *   g_i  = average rating for the listing (1..5)
 *   K    = rating count required for full confidence
 *   μ    = marketplace prior (1..5)
 *
 * When v_i = 0 the item has insufficient rating information; callers
 * must skip itemRatingScore entirely (no penalty, no zero default).
 */
@Injectable()
export class ListingRatingService {
  static readonly K = 30;
  static readonly PRIOR = 3.7;

  compute(input: {
    averageRating: number;
    distinctRaterCount: number;
  }): {
    distinctRaterCount: number;
    averageRating: number;
    confidence: number;
    adjustedRating: number;
    itemRatingScore: number | null;
    insufficient: boolean;
  } {
    const v = Math.max(0, Math.floor(input.distinctRaterCount));
    const g = clamp(input.averageRating, 0, 5);

    if (v === 0) {
      return {
        distinctRaterCount: 0,
        averageRating: 0,
        confidence: 0,
        adjustedRating: ListingRatingService.PRIOR,
        itemRatingScore: null,
        insufficient: true,
      };
    }

    const c = Math.min(1, v / ListingRatingService.K);
    const adjustedRating = g * c + ListingRatingService.PRIOR * (1 - c);
    const itemRatingScore = clamp(2 * adjustedRating, 0, 10);

    return {
      distinctRaterCount: v,
      averageRating: g,
      confidence: c,
      adjustedRating,
      itemRatingScore,
      insufficient: false,
    };
  }
}

function clamp(value: number, lo: number, hi: number): number {
  if (Number.isNaN(value)) return lo;
  return Math.max(lo, Math.min(hi, value));
}
