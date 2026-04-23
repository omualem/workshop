"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleSearchInputSchema = exports.requestedItemSchema = exports.requestedItemConstraintsSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
const ranking_1 = require("./ranking");
exports.requestedItemConstraintsSchema = zod_1.z.object({
    priceMax: zod_1.z.number().positive().optional(),
    distanceMaxKm: zod_1.z.number().positive().optional(),
    conditionMin: zod_1.z.string().optional(),
    attributes: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    exactListingId: zod_1.z.string().uuid().optional(),
});
exports.requestedItemSchema = zod_1.z.object({
    slotKey: zod_1.z.string().min(1).max(64),
    categoryId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().min(1).max(50),
    optional: zod_1.z.boolean().default(false),
    constraints: exports.requestedItemConstraintsSchema.default({}),
});
exports.bundleSearchInputSchema = zod_1.z.object({
    requestedItems: zod_1.z.array(exports.requestedItemSchema).min(1).max(12),
    dateRange: common_1.dateRangeSchema,
    renterLocation: common_1.coordinatesSchema.extend({
        addressText: zod_1.z.string().min(2).max(255),
    }),
    preferenceProfile: ranking_1.preferenceProfileSchema.default("balanced"),
    weights: ranking_1.rankingWeightsSchema.optional(),
    maxBudget: zod_1.z.number().positive().optional(),
    maxPickupPoints: zod_1.z.number().int().min(1).max(10).optional(),
    sameLenderPreferred: zod_1.z.boolean().default(false),
    deliveryPreferred: zod_1.z.boolean().default(false),
    exactDatesOnly: zod_1.z.boolean().default(true),
    debug: zod_1.z.boolean().default(false),
});
//# sourceMappingURL=bundle-search.js.map