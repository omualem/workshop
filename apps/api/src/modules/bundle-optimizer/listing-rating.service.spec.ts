import { ListingRatingService } from "./listing-rating.service";

describe("ListingRatingService", () => {
  const svc = new ListingRatingService();

  it("returns null itemRatingScore and insufficient=true when distinctRaterCount = 0", () => {
    const r = svc.compute({ averageRating: 5, distinctRaterCount: 0 });
    expect(r.itemRatingScore).toBeNull();
    expect(r.insufficient).toBe(true);
    expect(r.confidence).toBe(0);
  });

  it("scales confidence linearly up to K", () => {
    const low = svc.compute({ averageRating: 5, distinctRaterCount: 3 });
    const high = svc.compute({ averageRating: 5, distinctRaterCount: 30 });
    expect(low.confidence).toBeCloseTo(3 / 30);
    expect(high.confidence).toBe(1);
  });

  it("low confidence pulls a perfect rating strongly toward the 3.7 prior", () => {
    const fewRaters = svc.compute({ averageRating: 5, distinctRaterCount: 1 });
    const manyRaters = svc.compute({ averageRating: 5, distinctRaterCount: 30 });
    // 1 rater: c=1/30, adj = 5*(1/30) + 3.7*(29/30) ≈ 3.74 → score ≈ 7.48
    // 30 raters: c=1, adj = 5 → score = 10
    expect(fewRaters.itemRatingScore!).toBeLessThan(manyRaters.itemRatingScore!);
    expect(fewRaters.itemRatingScore!).toBeLessThan(8);
    expect(manyRaters.itemRatingScore).toBe(10);
  });

  it("rating 4.5 with many raters beats rating 5 with a single rater", () => {
    const oneRater5 = svc.compute({ averageRating: 5, distinctRaterCount: 1 });
    const manyRaters45 = svc.compute({ averageRating: 4.5, distinctRaterCount: 30 });
    expect(manyRaters45.itemRatingScore!).toBeGreaterThan(
      oneRater5.itemRatingScore!,
    );
  });

  it("clamps the final score into [0,10]", () => {
    const negative = svc.compute({ averageRating: -1, distinctRaterCount: 30 });
    const above = svc.compute({ averageRating: 100, distinctRaterCount: 30 });
    expect(negative.itemRatingScore).toBeGreaterThanOrEqual(0);
    expect(above.itemRatingScore).toBeLessThanOrEqual(10);
  });
});
