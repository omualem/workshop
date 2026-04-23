export declare class BundleExplanationService {
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
    }): {
        he: {
            title: string;
            subtitle: string;
            strengths: string[];
            tradeoffs: string[];
        };
        en: {
            title: string;
            subtitle: string;
        };
        chips: string[];
        debugLabels: (string | null)[];
    };
    private buildSubtitle;
    private translateTitle;
    private translateSubtitle;
}
