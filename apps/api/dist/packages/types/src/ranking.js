"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferenceProfileSchema = exports.rankingWeightsSchema = void 0;
const zod_1 = require("zod");
exports.rankingWeightsSchema = zod_1.z.object({
    price: zod_1.z.number().min(0).max(1),
    reliability: zod_1.z.number().min(0).max(1),
    logistics: zod_1.z.number().min(0).max(1),
    availability: zod_1.z.number().min(0).max(1),
    quality: zod_1.z.number().min(0).max(1),
});
exports.preferenceProfileSchema = zod_1.z.enum([
    "balanced",
    "cheapest",
    "mostReliable",
    "easiestPickup",
    "bestDateFit",
    "custom",
]);
//# sourceMappingURL=ranking.js.map