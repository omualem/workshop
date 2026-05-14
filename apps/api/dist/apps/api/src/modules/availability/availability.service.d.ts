import { PrismaService } from "../../prisma/prisma.service";
export declare class AvailabilityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getBookedQuantity(listingId: string, startDate: Date, endDate: Date): Promise<number>;
    getBlockedQuantity(listingId: string, startDate: Date, endDate: Date): Promise<number>;
    getAvailabilityReason(listingId: string, startDate: Date, endDate: Date): Promise<"blocked" | "booked" | "maintenance">;
    isListingAvailable(listingId: string, quantity: number, startDate: Date, endDate: Date, inventoryCount?: number): Promise<boolean>;
    availabilityFragilityScore(listingId: string, startDate: Date, endDate: Date): Promise<number>;
}
