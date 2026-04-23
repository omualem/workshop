export declare class CreateListingDto {
    categoryId: string;
    titleHe: string;
    titleEn: string;
    descriptionHe: string;
    descriptionEn: string;
    condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE";
    basePriceDaily: number;
    depositAmount: number;
    pickupLat: number;
    pickupLng: number;
    pickupAddressText: string;
    deliverySupported: boolean;
    inventoryCount: number;
    minRentalDays: number;
    maxRentalDays: number;
    attributeValues?: Array<{
        attributeKey: string;
        attributeValue: unknown;
    }>;
}
