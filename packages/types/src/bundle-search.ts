import { z } from "zod";
import { coordinatesSchema, dateRangeSchema } from "./common";
import { preferenceProfileSchema, rankingWeightsSchema } from "./ranking";

export const requestedItemConstraintsSchema = z.object({
  priceMax: z.number().positive().optional(),
  distanceMaxKm: z.number().positive().optional(),
  conditionMin: z.string().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  exactListingId: z.string().uuid().optional(),
});

export const requestedItemSchema = z.object({
  slotKey: z.string().min(1).max(64),
  categoryId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50),
  optional: z.boolean().default(false),
  constraints: requestedItemConstraintsSchema.default({}),
});

export const bundleSearchInputSchema = z.object({
  requestedItems: z.array(requestedItemSchema).min(1).max(12),
  dateRange: dateRangeSchema,
  renterLocation: coordinatesSchema.extend({
    addressText: z.string().min(2).max(255),
  }),
  preferenceProfile: preferenceProfileSchema.default("balanced"),
  weights: rankingWeightsSchema.optional(),
  maxBudget: z.number().positive().optional(),
  maxPickupPoints: z.number().int().min(1).max(10).optional(),
  sameLenderPreferred: z.boolean().default(false),
  deliveryPreferred: z.boolean().default(false),
  exactDatesOnly: z.boolean().default(true),
  debug: z.boolean().default(false),
});

export type RequestedItemInput = z.infer<typeof requestedItemSchema>;
export type BundleSearchInput = z.infer<typeof bundleSearchInputSchema>;
export type BundleSearchFormInput = z.input<typeof bundleSearchInputSchema>;
