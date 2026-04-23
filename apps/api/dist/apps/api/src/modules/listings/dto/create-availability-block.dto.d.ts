export declare class CreateAvailabilityBlockDto {
    startDate: string;
    endDate: string;
    status: "AVAILABLE" | "BLOCKED" | "BOOKED" | "MAINTENANCE";
    quantity: number;
    reason?: string;
}
