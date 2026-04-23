import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        test: "test";
        production: "production";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    JWT_ACCESS_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_ACCESS_TTL: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_TTL: z.ZodDefault<z.ZodString>;
    NEXT_PUBLIC_API_URL: z.ZodOptional<z.ZodString>;
    NEXT_PUBLIC_DEFAULT_LOCALE: z.ZodDefault<z.ZodString>;
    REQUEST_LOG_LEVEL: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type EnvConfig = z.infer<typeof envSchema>;
export declare const validateEnv: (input: Record<string, unknown>) => {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string | undefined;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_TTL: string;
    JWT_REFRESH_TTL: string;
    NEXT_PUBLIC_DEFAULT_LOCALE: string;
    REQUEST_LOG_LEVEL: string;
    NEXT_PUBLIC_API_URL?: string | undefined;
};
