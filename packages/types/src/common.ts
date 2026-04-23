import { z } from "zod";

export const localeSchema = z.enum(["he", "en"]);

export const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
