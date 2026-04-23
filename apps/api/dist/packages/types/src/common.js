"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeSchema = exports.coordinatesSchema = exports.localeSchema = void 0;
const zod_1 = require("zod");
exports.localeSchema = zod_1.z.enum(["he", "en"]);
exports.coordinatesSchema = zod_1.z.object({
    lat: zod_1.z.number(),
    lng: zod_1.z.number(),
});
exports.dateRangeSchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
});
//# sourceMappingURL=common.js.map