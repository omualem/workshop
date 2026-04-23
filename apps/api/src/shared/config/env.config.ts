import { z } from "zod";

const optionalString = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  });

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: optionalString,
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("he"),
  REQUEST_LOG_LEVEL: z.string().default("debug"),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = (input: Record<string, unknown>) => envSchema.parse(input);
