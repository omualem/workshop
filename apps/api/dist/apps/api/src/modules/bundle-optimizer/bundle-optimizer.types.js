"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizerRequestBodySchema = exports.optimizerPreferencesSchema = exports.preferenceSlidersSchema = exports.basePreferenceProfileSchema = exports.preferenceProfileSchema = exports.optimizerWeightsSchema = exports.slotInputSchema = exports.slotConstraintsSchema = void 0;
const zod_1 = require("zod");
exports.slotConstraintsSchema = zod_1.z
    .object({
    minPrice: zod_1.z.number().nonnegative().optional(),
    maxPrice: zod_1.z.number().nonnegative().optional(),
    maxDistanceKm: zod_1.z.number().positive().optional(),
    allowAlternatives: zod_1.z.boolean().optional(),
})
    .refine((c) => c.minPrice === undefined || c.maxPrice === undefined || c.maxPrice >= c.minPrice, { message: "maxPrice must be >= minPrice" })
    .optional();
exports.slotInputSchema = zod_1.z
    .object({
    slotKey: zod_1.z.string().min(1),
    mode: zod_1.z.enum(["category", "specificListing"]).default("category"),
    categoryId: zod_1.z.string().min(1).optional(),
    specificListingId: zod_1.z.string().min(1).optional(),
    quantity: zod_1.z.number().int().positive().default(1),
    constraints: exports.slotConstraintsSchema,
})
    .superRefine((slot, ctx) => {
    if (slot.mode === "category" && !slot.categoryId) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "categoryId is required when mode = 'category'",
            path: ["categoryId"],
        });
    }
    if (slot.mode === "specificListing" && !slot.specificListingId) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "specificListingId is required when mode = 'specificListing'",
            path: ["specificListingId"],
        });
    }
});
exports.optimizerWeightsSchema = zod_1.z.object({
    price: zod_1.z.number().min(0),
    distance: zod_1.z.number().min(0),
    reliability: zod_1.z.number().min(0),
    availability: zod_1.z.number().min(0),
});
exports.preferenceProfileSchema = zod_1.z.enum([
    "balanced",
    "cheapest",
    "closest",
    "minimalEffort",
    "professional",
    "custom",
]);
exports.basePreferenceProfileSchema = exports.preferenceProfileSchema.exclude([
    "custom",
]);
exports.preferenceSlidersSchema = zod_1.z.object({
    price: zod_1.z.number().min(1).max(10),
    distance: zod_1.z.number().min(1).max(10),
    reliability: zod_1.z.number().min(1).max(10),
    availability: zod_1.z.number().min(1).max(10),
    pickupSimplicity: zod_1.z.number().min(1).max(10),
});
exports.optimizerPreferencesSchema = zod_1.z.object({
    weights: exports.optimizerWeightsSchema.default({
        price: 0.2,
        distance: 0.25,
        reliability: 0.25,
        availability: 0.3,
    }),
    lambdaVariance: zod_1.z.number().min(0).default(0.35),
    alphaBottleneck: zod_1.z.number().min(0).default(0.25),
    betaPickup: zod_1.z.number().min(0).default(0.4),
    gammaMaxDistance: zod_1.z.number().min(0).default(0.15),
    alphaDistanceMix: zod_1.z.number().min(0).max(1).default(0.6),
    topKPerSlot: zod_1.z.number().int().positive().max(200).default(30),
    beamWidth: zod_1.z.number().int().positive().max(500).default(50),
});
exports.optimizerRequestBodySchema = zod_1.z.object({
    slots: zod_1.z.array(exports.slotInputSchema).min(1),
    dateRange: zod_1.z.object({
        startDate: zod_1.z.string(),
        endDate: zod_1.z.string(),
    }),
    userLocation: zod_1.z
        .object({
        lat: zod_1.z.number().optional(),
        lng: zod_1.z.number().optional(),
        address: zod_1.z.string().optional(),
        cityId: zod_1.z.string().min(1).optional(),
        streetId: zod_1.z.string().min(1).optional(),
        addressNumber: zod_1.z.number().int().positive().optional(),
    })
        .refine((loc) => (loc.lat !== undefined && loc.lng !== undefined) ||
        (loc.cityId !== undefined &&
            loc.streetId !== undefined &&
            loc.addressNumber !== undefined), {
        message: "userLocation requires either {lat, lng} or {cityId, streetId, addressNumber}",
    }),
    budget: zod_1.z.number().positive(),
    maxPickupPoints: zod_1.z.number().int().positive().max(20).optional(),
    preferenceProfile: exports.preferenceProfileSchema.optional(),
    basePreferenceProfile: exports.basePreferenceProfileSchema.optional(),
    preferenceSliders: exports.preferenceSlidersSchema.optional(),
});
//# sourceMappingURL=bundle-optimizer.types.js.map