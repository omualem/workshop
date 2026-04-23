import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";
import { BookingsService } from "./bookings.service";
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(user: {
        sub: string;
    }, dto: CreateBookingDto): Promise<any>;
    renterBookings(user: {
        sub: string;
    }): Promise<({
        items: ({
            listing: {
                status: import(".prisma/client").$Enums.ListingStatus;
                categoryId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                lenderId: string;
                titleHe: string;
                titleEn: string;
                descriptionHe: string;
                descriptionEn: string;
                condition: import(".prisma/client").$Enums.ListingCondition;
                basePriceDaily: import("@prisma/client/runtime/library").Decimal;
                depositAmount: import("@prisma/client/runtime/library").Decimal;
                qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
                pickupLat: import("@prisma/client/runtime/library").Decimal;
                pickupLng: import("@prisma/client/runtime/library").Decimal;
                pickupAddressText: string;
                deliverySupported: boolean;
                inventoryCount: number;
                minRentalDays: number;
                maxRentalDays: number;
            };
        } & {
            quantity: number;
            id: string;
            listingId: string;
            lenderId: string;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            bookingId: string;
            itemPrice: import("@prisma/client/runtime/library").Decimal;
            pickupMethod: import(".prisma/client").$Enums.PickupMethod;
            pickupWindow: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        status: import(".prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        id: string;
        renterId: string;
        createdAt: Date;
        updatedAt: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        bundleCandidateId: string | null;
        totalDeposit: import("@prisma/client/runtime/library").Decimal;
        logisticsScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        reliabilityScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentReference: string | null;
    })[]>;
    lenderBookings(user: {
        sub: string;
    }): Promise<({
        renter: {
            id: string;
            fullName: string;
            email: string;
        };
        items: ({
            listing: {
                status: import(".prisma/client").$Enums.ListingStatus;
                categoryId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                lenderId: string;
                titleHe: string;
                titleEn: string;
                descriptionHe: string;
                descriptionEn: string;
                condition: import(".prisma/client").$Enums.ListingCondition;
                basePriceDaily: import("@prisma/client/runtime/library").Decimal;
                depositAmount: import("@prisma/client/runtime/library").Decimal;
                qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
                pickupLat: import("@prisma/client/runtime/library").Decimal;
                pickupLng: import("@prisma/client/runtime/library").Decimal;
                pickupAddressText: string;
                deliverySupported: boolean;
                inventoryCount: number;
                minRentalDays: number;
                maxRentalDays: number;
            };
        } & {
            quantity: number;
            id: string;
            listingId: string;
            lenderId: string;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            bookingId: string;
            itemPrice: import("@prisma/client/runtime/library").Decimal;
            pickupMethod: import(".prisma/client").$Enums.PickupMethod;
            pickupWindow: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        status: import(".prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        id: string;
        renterId: string;
        createdAt: Date;
        updatedAt: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        bundleCandidateId: string | null;
        totalDeposit: import("@prisma/client/runtime/library").Decimal;
        logisticsScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        reliabilityScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentReference: string | null;
    })[]>;
    updateStatus(user: {
        sub: string;
    }, id: string, dto: UpdateBookingStatusDto): Promise<{
        status: import(".prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        id: string;
        renterId: string;
        createdAt: Date;
        updatedAt: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        bundleCandidateId: string | null;
        totalDeposit: import("@prisma/client/runtime/library").Decimal;
        logisticsScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        reliabilityScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentReference: string | null;
    }>;
}
