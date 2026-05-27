export declare class ListingRatingService {
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
    };
}
