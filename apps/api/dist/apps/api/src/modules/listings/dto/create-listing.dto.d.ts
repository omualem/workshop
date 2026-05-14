export declare class ListingAttributeValueInputDto {
    attributeKey: string;
    attributeValue: unknown;
}
export declare class ListingAvailabilityBlockInputDto {
    startDate: string;
    endDate: string;
    status?: "AVAILABLE" | "BLOCKED" | "BOOKED" | "MAINTENANCE";
    quantity?: number;
    reason?: string;
}
export declare class CreateListingDto {
    categoryId: string;
    cityId: string;
    streetId: string;
    addressNumber: number;
    titleHe: string;
    titleEn: string;
    descriptionHe: string;
    descriptionEn: string;
    suitableFor?: string;
    mainUses?: string;
    condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE";
    basePriceDaily: number;
    depositAmount: number;
    pickupLat?: number;
    pickupLng?: number;
    pickupAddressText?: string;
    city?: string;
    pickupInstructions?: string;
    deliverySupported: boolean;
    includedItems?: string[];
    cancellationPolicy?: string;
    returnTerms?: string;
    requiresOperator?: boolean;
    setupRequired?: boolean;
    inventoryCount: number;
    minRentalDays: number;
    maxRentalDays: number;
    attributeValues?: ListingAttributeValueInputDto[];
    availabilityBlocks?: ListingAvailabilityBlockInputDto[];
}
