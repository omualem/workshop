import { z } from "zod";
export declare const requestedItemConstraintsSchema: z.ZodObject<{
    priceMax: z.ZodOptional<z.ZodNumber>;
    distanceMaxKm: z.ZodOptional<z.ZodNumber>;
    conditionMin: z.ZodOptional<z.ZodString>;
    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    exactListingId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const requestedItemSchema: z.ZodObject<{
    slotKey: z.ZodString;
    categoryId: z.ZodString;
    quantity: z.ZodNumber;
    optional: z.ZodDefault<z.ZodBoolean>;
    constraints: z.ZodDefault<z.ZodObject<{
        priceMax: z.ZodOptional<z.ZodNumber>;
        distanceMaxKm: z.ZodOptional<z.ZodNumber>;
        conditionMin: z.ZodOptional<z.ZodString>;
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        exactListingId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const bundleSearchInputSchema: z.ZodObject<{
    requestedItems: z.ZodArray<z.ZodObject<{
        slotKey: z.ZodString;
        categoryId: z.ZodString;
        quantity: z.ZodNumber;
        optional: z.ZodDefault<z.ZodBoolean>;
        constraints: z.ZodDefault<z.ZodObject<{
            priceMax: z.ZodOptional<z.ZodNumber>;
            distanceMaxKm: z.ZodOptional<z.ZodNumber>;
            conditionMin: z.ZodOptional<z.ZodString>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            exactListingId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    dateRange: z.ZodObject<{
        startDate: z.ZodString;
        endDate: z.ZodString;
    }, z.core.$strip>;
    renterLocation: z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
        addressText: z.ZodString;
    }, z.core.$strip>;
    preferenceProfile: z.ZodDefault<z.ZodEnum<{
        balanced: "balanced";
        cheapest: "cheapest";
        mostReliable: "mostReliable";
        easiestPickup: "easiestPickup";
        bestDateFit: "bestDateFit";
        custom: "custom";
    }>>;
    weights: z.ZodOptional<z.ZodObject<{
        price: z.ZodNumber;
        reliability: z.ZodNumber;
        logistics: z.ZodNumber;
        availability: z.ZodNumber;
        quality: z.ZodNumber;
    }, z.core.$strip>>;
    maxBudget: z.ZodOptional<z.ZodNumber>;
    maxPickupPoints: z.ZodOptional<z.ZodNumber>;
    sameLenderPreferred: z.ZodDefault<z.ZodBoolean>;
    deliveryPreferred: z.ZodDefault<z.ZodBoolean>;
    exactDatesOnly: z.ZodDefault<z.ZodBoolean>;
    debug: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type RequestedItemInput = z.infer<typeof requestedItemSchema>;
export type BundleSearchInput = z.infer<typeof bundleSearchInputSchema>;
export type BundleSearchFormInput = z.input<typeof bundleSearchInputSchema>;
