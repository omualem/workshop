"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(120),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(8).max(32),
    password: zod_1.z.string().min(8).max(128),
    role: zod_1.z.enum(["RENTER", "LENDER"]),
});
//# sourceMappingURL=auth.js.map