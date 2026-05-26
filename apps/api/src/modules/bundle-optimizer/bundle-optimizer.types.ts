/**
 * Bundle Optimizer type definitions.
 *
 * Mathematical model symbols mapped to TypeScript names:
 *   S          -> slots
 *   I_s        -> candidatesBySlot[s]
 *   x_i        -> SelectedItem (the selected listing for a slot)
 *   p_i        -> price
 *   d_i        -> distanceKm
 *   r_i        -> reliabilityScore
 *   a_i        -> availability
 *   L(i)       -> lenderId
 *   B          -> budget
 *   w_j        -> weights (per-dimension)
 *   M_j(x)     -> bundle-level normalized metrics in [0,10]
 *   Var(M(x))  -> variance across the 4 bundle metrics
 *   min_j M_j  -> bottleneck term
 *   P_u(x)     -> pickup-complexity penalty (number of unique lenders)
 *   lambda, alpha, beta -> lambdaVariance, alphaBottleneck, betaPickup
 */

import { z } from "zod";

// Per-slot soft + hard constraints (mapped to candidate filter logic).
//   minPrice / maxPrice  -> hard filter on listing price
//   maxDistanceKm        -> hard filter on haversine distance from userLocation
//   allowAlternatives    -> for specificListing slots, expand I_s with same-category siblings
export const slotConstraintsSchema = z
  .object({
    minPrice: z.number().nonnegative().optional(),
    maxPrice: z.number().nonnegative().optional(),
    maxDistanceKm: z.number().positive().optional(),
    allowAlternatives: z.boolean().optional(),
  })
  .refine(
    (c) => c.minPrice === undefined || c.maxPrice === undefined || c.maxPrice >= c.minPrice,
    { message: "maxPrice must be >= minPrice" },
  )
  .optional();

// A slot s is one entry in the user's bundle request. Two modes:
//   "category"        -> I_s = all ACTIVE listings in categoryId matching constraints
//   "specificListing" -> I_s = {specificListingId} (+ alternatives if allowed)
export const slotInputSchema = z
  .object({
    slotKey: z.string().min(1),
    mode: z.enum(["category", "specificListing"]).default("category"),
    categoryId: z.string().min(1).optional(),
    specificListingId: z.string().min(1).optional(),
    quantity: z.number().int().positive().default(1),
    constraints: slotConstraintsSchema,
  })
  .superRefine((slot, ctx) => {
    if (slot.mode === "category" && !slot.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "categoryId is required when mode = 'category'",
        path: ["categoryId"],
      });
    }
    if (slot.mode === "specificListing" && !slot.specificListingId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "specificListingId is required when mode = 'specificListing'",
        path: ["specificListingId"],
      });
    }
  });

export const optimizerWeightsSchema = z.object({
  price: z.number().min(0),
  distance: z.number().min(0),
  reliability: z.number().min(0),
  availability: z.number().min(0),
});

export const preferenceProfileSchema = z.enum([
  "balanced",
  "cheapest",
  "closest",
  "minimalEffort",
  "professional",
  "custom",
]);

export const basePreferenceProfileSchema = preferenceProfileSchema.exclude([
  "custom",
]);

export const preferenceSlidersSchema = z.object({
  price: z.number().min(1).max(10),
  distance: z.number().min(1).max(10),
  reliability: z.number().min(1).max(10),
  availability: z.number().min(1).max(10),
  pickupSimplicity: z.number().min(1).max(10),
});

export const optimizerPreferencesSchema = z.object({
  weights: optimizerWeightsSchema.default({
    price: 0.2,
    distance: 0.25,
    reliability: 0.25,
    availability: 0.3,
  }),
  lambdaVariance: z.number().min(0).default(0.35),
  alphaBottleneck: z.number().min(0).default(0.25),
  betaPickup: z.number().min(0).default(0.4),
  // gamma - penalty on the worst pickup distance in the bundle.
  gammaMaxDistance: z.number().min(0).default(0.15),
  // alpha_dist - convex mix between average and worst-case distance:
  //   D(x) = alpha_dist * mean(d_i) + (1 - alpha_dist) * max(d_i)
  alphaDistanceMix: z.number().min(0).max(1).default(0.6),
  topKPerSlot: z.number().int().positive().max(200).default(30),
  beamWidth: z.number().int().positive().max(500).default(50),
});

/**
 * Wire schema - what the client may send. All algorithm-tuning parameters
 * are deliberately absent here. Zod strips unknown keys by default, so old
 * legacy item-state fields from previous clients are ignored before scoring.
 */
export const optimizerRequestBodySchema = z.object({
  slots: z.array(slotInputSchema).min(1),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  userLocation: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
      address: z.string().optional(),
      cityId: z.string().min(1).optional(),
      streetId: z.string().min(1).optional(),
      addressNumber: z.number().int().positive().optional(),
    })
    .refine(
      (loc) =>
        (loc.lat !== undefined && loc.lng !== undefined) ||
        (loc.cityId !== undefined &&
          loc.streetId !== undefined &&
          loc.addressNumber !== undefined),
      {
        message:
          "userLocation requires either {lat, lng} or {cityId, streetId, addressNumber}",
      },
    ),
  budget: z.number().positive(),
  maxPickupPoints: z.number().int().positive().max(20).optional(),
  preferenceProfile: preferenceProfileSchema.optional(),
  basePreferenceProfile: basePreferenceProfileSchema.optional(),
  preferenceSliders: preferenceSlidersSchema.optional(),
});

export type OptimizerWeights = z.infer<typeof optimizerWeightsSchema>;
export type OptimizerPreferences = z.infer<typeof optimizerPreferencesSchema>;
export type PreferenceProfile = z.infer<typeof preferenceProfileSchema>;
export type BasePreferenceProfile = z.infer<typeof basePreferenceProfileSchema>;
export type PreferenceSliders = z.infer<typeof preferenceSlidersSchema>;
export type OptimizerRequestBody = z.infer<typeof optimizerRequestBodySchema>;
export type OptimizerRequest = OptimizerRequestBody & {
  preferences: OptimizerPreferences;
};
export type SlotInput = z.infer<typeof slotInputSchema>;
export type SlotConstraints = NonNullable<z.infer<typeof slotConstraintsSchema>>;

/** A listing x_i in I_s evaluated as a candidate item. */
export interface CandidateItem {
  slotKey: string;
  listingId: string;
  lenderId: string;
  pickupKey: string;
  titleHe: string;
  titleEn: string;
  categoryId: string;
  price: number;
  distanceKm: number;
  reliability: number;
  availability: number;
  pickupLat: number;
  pickupLng: number;
  inventoryCount: number;
  lenderCompletedTransactions?: number;
  attributeValues: Array<{
    attributeKey: string;
    attributeValue: unknown;
  }>;
  deviationDays: number;
  m_price: number;
  m_distance: number;
  m_reliability: number;
  m_availability: number;
  preliminaryScore: number;
}

export interface SlotFilterDebug {
  listingId: string;
  titleHe: string;
  distanceKm: number;
  availability: boolean;
  durationDays: number;
  minRentalDays: number;
  maxRentalDays: number;
  filteredOutBy?: "availability" | "rentalDays" | "distance";
}

/** A complete bundle selection x = (x_s1, x_s2, ..., x_sn). */
export interface SelectedBundle {
  items: CandidateItem[];
  totalPrice: number;
  uniqueLenderCount: number;
  uniquePickupCount: number;
}

/** The four bundle-level metrics M_j(x). */
export interface BundleMetrics {
  price: number;
  distance: number;
  reliability: number;
  availability: number;
}

export interface ScoreBreakdown {
  weightedUtility: number;
  variancePenalty: number;
  bottleneckTerm: number;
  pickupPenalty: number;
  maxDistancePenalty: number;
  lowScorePenalty: number;
  lowScorePenaltyBreakdown: {
    price: number;
    distance: number;
    reliability: number;
    availability: number;
  };
  preferences: {
    profile: PreferenceProfile;
    baseProfile?: BasePreferenceProfile;
    sliders: PreferenceSliders;
    normalizedWeights: OptimizerWeights;
    penaltyMultipliers: {
      pickup: number;
      lowScore: {
        price: number;
        distance: number;
        reliability: number;
        availability: number;
      };
      maxDistance: number;
      variance: number;
      bottleneck: number;
    };
  };
  rawFinalScore: number;
  finalScore: number;
}

export interface ResolvedOptimizerPreferences {
  profile: PreferenceProfile;
  baseProfile?: BasePreferenceProfile;
  sliders: PreferenceSliders;
  weights: OptimizerWeights;
  penaltyWeights: ScoreBreakdown["preferences"]["penaltyMultipliers"];
  lambdaVariance: number;
  alphaBottleneck: number;
  betaPickup: number;
  gammaMaxDistance: number;
  alphaDistanceMix: number;
  topKPerSlot: number;
  beamWidth: number;
}

/** Quantities derived from raw signals and reported in the output. */
export interface DerivedQuantities {
  avgDistance: number;
  maxDistance: number;
  pickupCost: number;
  pickupStops: number;
  deviationDaysSum: number;
}

export interface ScoredBundle {
  bundle: SelectedBundle;
  metrics: BundleMetrics;
  derived: DerivedQuantities;
  breakdown: ScoreBreakdown;
}
