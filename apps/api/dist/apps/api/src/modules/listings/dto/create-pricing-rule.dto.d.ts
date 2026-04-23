export declare class CreatePricingRuleDto {
    ruleType: string;
    minDays?: number;
    maxDays?: number;
    percentDiscount?: number;
    fixedOverride?: number;
    weekendAdjustment?: number;
    seasonalAdjustment?: number;
    startsAt?: string;
    endsAt?: string;
}
