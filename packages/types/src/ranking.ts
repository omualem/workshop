import { z } from "zod";

export const rankingWeightsSchema = z.object({
  price: z.number().min(0).max(1),
  reliability: z.number().min(0).max(1),
  logistics: z.number().min(0).max(1),
  availability: z.number().min(0).max(1),
  quality: z.number().min(0).max(1),
});

export const preferenceProfileSchema = z.enum([
  "balanced",
  "cheapest",
  "mostReliable",
  "easiestPickup",
  "bestDateFit",
  "custom",
]);

export type RankingWeights = z.infer<typeof rankingWeightsSchema>;
export type PreferenceProfile = z.infer<typeof preferenceProfileSchema>;
