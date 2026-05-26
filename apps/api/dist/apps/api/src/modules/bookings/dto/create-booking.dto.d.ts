declare class BookingItemInputDto {
    listingId: string;
    quantity: number;
    pickupMethod: "PICKUP" | "DELIVERY" | "HYBRID";
}
export declare class CreateBookingDto {
    startDate: string;
    endDate: string;
    totalPrice: number;
    totalDeposit?: number;
    items: BookingItemInputDto[];
}
export {};
