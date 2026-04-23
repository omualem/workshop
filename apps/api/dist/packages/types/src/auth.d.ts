import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{
        RENTER: "RENTER";
        LENDER: "LENDER";
    }>;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
