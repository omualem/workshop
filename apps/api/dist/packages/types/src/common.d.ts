import { z } from "zod";
export declare const localeSchema: z.ZodEnum<{
    he: "he";
    en: "en";
}>;
export declare const coordinatesSchema: z.ZodObject<{
    lat: z.ZodNumber;
    lng: z.ZodNumber;
}, z.core.$strip>;
export declare const dateRangeSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
}, z.core.$strip>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
