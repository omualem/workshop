import { z } from "zod";
export declare const rankingWeightsSchema: z.ZodObject<{
    price: z.ZodNumber;
    reliability: z.ZodNumber;
    logistics: z.ZodNumber;
    availability: z.ZodNumber;
    quality: z.ZodNumber;
}, z.core.$strip>;
export declare const preferenceProfileSchema: z.ZodEnum<{
    balanced: "balanced";
    cheapest: "cheapest";
    mostReliable: "mostReliable";
    easiestPickup: "easiestPickup";
    bestDateFit: "bestDateFit";
    custom: "custom";
}>;
export type RankingWeights = z.infer<typeof rankingWeightsSchema>;
export type PreferenceProfile = z.infer<typeof preferenceProfileSchema>;
