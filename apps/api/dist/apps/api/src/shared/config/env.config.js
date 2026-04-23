"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = exports.envSchema = void 0;
const zod_1 = require("zod");
const optionalString = zod_1.z
    .string()
    .optional()
    .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
});
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z.string().min(1),
    REDIS_URL: optionalString,
    JWT_ACCESS_SECRET: zod_1.z.string().min(16),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16),
    JWT_ACCESS_TTL: zod_1.z.string().default("15m"),
    JWT_REFRESH_TTL: zod_1.z.string().default("7d"),
    NEXT_PUBLIC_API_URL: zod_1.z.string().url().optional(),
    NEXT_PUBLIC_DEFAULT_LOCALE: zod_1.z.string().default("he"),
    REQUEST_LOG_LEVEL: zod_1.z.string().default("debug"),
});
const validateEnv = (input) => exports.envSchema.parse(input);
exports.validateEnv = validateEnv;
//# sourceMappingURL=env.config.js.map