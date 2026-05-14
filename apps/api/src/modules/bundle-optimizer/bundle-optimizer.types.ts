/**
 * Bundle Optimizer — type definitions.
 *
 * Mathematical model symbols mapped to TypeScript names:
 *   S          → slots
 *   I_s        → candidatesBySlot[s]
 *   x_i        → SelectedItem (the selected listing for a slot)
 *   p_i        → price
 *   d_i        → distanceKm
 *   r_i        → reliabilityScore
 *   c_i        → conditionScore
 *   a_i        → availability
 *   L(i)       → lenderId
 *   B          → budget
 *   w_j        → weights (per-dimension)
 *   M_j(x)     → bundle-level normalized metrics in [0,10]
 *   Var(M(x))  → variance across the 5 bundle metrics
 *   min_j M_j  → bottleneck term
 *   P_u(x)     → pickup-complexity penalty (number of unique lenders)
 *   λ, α, β    → lambdaVariance, alphaBottleneck, betaPickup
 */

import { z } from "zod";

export const conditionEnum = z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "HEAVY_USE"]);
export type ConditionLevel = z.infer<typeof conditionEnum>;

// Per-slot soft + hard constraints (mapped to candidate filter logic).
//   minPrice / maxPrice  → hard filter on listing price
//   minCondition         → hard filter on condition floor (already used)
//   maxDistanceKm        → hard filter on haversine distance from userLocation
//   allowAlternatives    → for specificListing slots, expand I_s with same-category siblings
export const slotConstraintsSchema = z
  .object({
    minPrice: z.number().nonnegative().optional(),
    maxPrice: z.number().nonnegative().optional(),
    minCondition: conditionEnum.optional(),
    maxDistanceKm: z.number().positive().optional(),
    allowAlternatives: z.boolean().optional(),
  })
  .refine(
    (c) => c.minPrice === undefined || c.maxPrice === undefined || c.maxPrice >= c.minPrice,
    { message: "maxPrice must be >= minPrice" },
  )
  .optional();

// A slot s is one entry in the user's bundle request. Two modes:
//   "category"        → I_s = all ACTIVE listings in categoryId matching constraints
//   "specificListing" → I_s = {specificListingId} (∪ alternatives if allowed)
export const slotInputSchema = z
  .object({
    slotKey: z.string().min(1),
    mode: z.enum(["category", "specificListing"]).default("category"),
    categoryId: z.string().min(1).optional(),
    specificListingId: z.string().min(1).optional(),
    quantity: z.number().int().positive().default(1),
    // Legacy top-level minCondition kept for backwards compat with old clients.
    minCondition: conditionEnum.optional(),
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
  condition: z.number().min(0),
  availability: z.number().min(0),
});

export const preferenceProfileSchema = z.enum([
  "balanced",
  "cheapest",
  "closest",
  "minimalEffort",
  "professional",
  "highQuality",
  "custom",
]);

export const basePreferenceProfileSchema = preferenceProfileSchema.exclude([
  "custom",
]);

export const preferenceSlidersSchema = z.object({
  price: z.number().min(1).max(10),
  distance: z.number().min(1).max(10),
  reliability: z.number().min(1).max(10),
  condition: z.number().min(1).max(10),
  availability: z.number().min(1).max(10),
  pickupSimplicity: z.number().min(1).max(10),
});

export const optimizerPreferencesSchema = z.object({
  weights: optimizerWeightsSchema.default({
    price: 0.2,
    distance: 0.2,
    reliability: 0.2,
    condition: 0.2,
    availability: 0.2,
  }),
  lambdaVariance: z.number().min(0).default(0.35),
  alphaBottleneck: z.number().min(0).default(0.25),
  betaPickup: z.number().min(0).default(0.4),
  // γ — penalty on the worst pickup distance in the bundle.
  gammaMaxDistance: z.number().min(0).default(0.15),
  // α_dist — convex mix between average and worst-case distance:
  //   D(x) = α_dist · mean(d_i) + (1 − α_dist) · max(d_i)
  alphaDistanceMix: z.number().min(0).max(1).default(0.6),
  topKPerSlot: z.number().int().positive().max(200).default(30),
  beamWidth: z.number().int().positive().max(500).default(50),
});

export const optimizerRequestSchema = z.object({
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
  preferences: optimizerPreferencesSchema.default({
    weights: {
      price: 0.2,
      distance: 0.2,
      reliability: 0.2,
      condition: 0.2,
      availability: 0.2,
    },
    lambdaVariance: 0.35,
    alphaBottleneck: 0.25,
    betaPickup: 0.4,
    gammaMaxDistance: 0.15,
    alphaDistanceMix: 0.6,
    topKPerSlot: 30,
    beamWidth: 50,
  }),
});

export type OptimizerWeights = z.infer<typeof optimizerWeightsSchema>;
export type OptimizerPreferences = z.infer<typeof optimizerPreferencesSchema>;
export type PreferenceProfile = z.infer<typeof preferenceProfileSchema>;
export type BasePreferenceProfile = z.infer<typeof basePreferenceProfileSchema>;
export type PreferenceSliders = z.infer<typeof preferenceSlidersSchema>;
export type OptimizerRequest = z.infer<typeof optimizerRequestSchema>;
export type SlotInput = z.infer<typeof slotInputSchema>;
export type SlotConstraints = NonNullable<z.infer<typeof slotConstraintsSchema>>;

/** A listing × slot binding evaluated as a candidate item x_i ∈ I_s. */
export interface CandidateItem {
  slotKey: string;
  listingId: string;
  lenderId: string;
  pickupKey: string;          // lender + pickup coordinates → unique pickup point
  titleHe: string;
  titleEn: string;
  categoryId: string;
  condition: ConditionLevel;
  price: number;              // p_i (currency, not normalized)
  distanceKm: number;         // d_i (kilometers, not normalized)
  reliability: number;        // r_i in [0,10]
  conditionScore: number;     // c_i in [0,10]
  availability: number;       // a_i in [0,10]; 10 = exact-date fit
  pickupLat: number;
  pickupLng: number;
  inventoryCount: number;
  /**
   * Lender's completed transactions count, threaded through so the
   * explanation layer can warn when a bundle includes a brand-new lender
   * (fewer than 5 completed transactions). Optional to avoid breaking
   * existing test fixtures that build CandidateItem without it.
   */
  lenderCompletedTransactions?: number;
  attributeValues: Array<{
    attributeKey: string;
    attributeValue: unknown;
  }>;
  // Deviation in days between requested range and the listing's calendar
  // (count of requested days that are blocked/booked but inventory still
  // covers the range overall — a slack signal, not a hard constraint).
  deviationDays: number;
  // Per-candidate normalized metrics (relative to the slot's candidate pool):
  m_price: number;
  m_distance: number;
  m_reliability: number;
  m_condition: number;
  m_availability: number;
  preliminaryScore: number;   // weighted sum used for top-K pruning
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

/** A complete bundle selection x = (x_{s1}, x_{s2}, ..., x_{sn}) — one item per slot. */
export interface SelectedBundle {
  items: CandidateItem[];
  totalPrice: number;
  uniqueLenderCount: number;
  uniquePickupCount: number;
}

/** The five bundle-level metrics M_j(x). Indexed by dimension name. */
export interface BundleMetrics {
  price: number;
  distance: number;
  reliability: number;
  condition: number;
  availability: number;
}

export interface ScoreBreakdown {
  weightedUtility: number;     // Σ_j w_j · M_j(x)
  variancePenalty: number;     // λ · Var(M(x))
  bottleneckTerm: number;      // α · min_j M_j(x)
  pickupPenalty: number;       // β · P_u(x)         (spatial pickup cost)
  maxDistancePenalty: number;  // γ · normalized max(d_i)
  lowScorePenalty: number;     // Σ_j ω_j · max(0, τ_j − M_j(x))
  lowScorePenaltyBreakdown: {
    price: number;
    distance: number;
    reliability: number;
    condition: number;
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
        condition: number;
        availability: number;
      };
      maxDistance: number;
      variance: number;
      bottleneck: number;
    };
  };
  rawFinalScore: number;       // pre-clamp Score(x)
  finalScore: number;          // clamp(Score(x), 0, 10)
}

export interface ResolvedOptimizerPreferences {
  profile: PreferenceProfile;
  baseProfile?: BasePreferenceProfile;
  sliders: PreferenceSliders;
  weights: OptimizerWeights;
  penaltyWeights: ScoreBreakdown["preferences"]["penaltyMultipliers"];
}

/** Quantities derived from raw signals and reported in the output. */
export interface DerivedQuantities {
  avgDistance: number;     // mean(d_i)
  maxDistance: number;     // max(d_i)
  pickupCost: number;      // Σ_{i<j} dist(L(i), L(j)), in km
  pickupStops: number;     // |unique pickup points|
  deviationDaysSum: number;
}

export interface ScoredBundle {
  bundle: SelectedBundle;
  metrics: BundleMetrics;
  derived: DerivedQuantities;
  breakdown: ScoreBreakdown;
}
