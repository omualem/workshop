import { PrismaService } from "../../prisma/prisma.service";
export declare class PricingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculateRentalDays(startDate: Date, endDate: Date): number;
    calculateListingPrice(listingId: string, startDate: Date, endDate: Date, quantity?: number): Promise<{
        days: number;
        total: number;
        perDay: number;
    } | null>;
    computeListingPrice(listing: {
        basePriceDaily: any;
        pricingRules: Array<{
            ruleType: string;
            minDays: number | null;
            maxDays: number | null;
            percentDiscount: any;
            fixedOverride: any;
            weekendAdjustment: any;
            seasonalAdjustment: any;
        }>;
    }, startDate: Date, endDate: Date, quantity?: number): {
        days: number;
        total: number;
        perDay: number;
    };
}
