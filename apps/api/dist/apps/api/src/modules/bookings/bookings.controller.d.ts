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
                city: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cityId: string | null;
                lenderId: string;
                categoryId: string;
                streetId: string | null;
                addressNumber: number | null;
                titleHe: string;
                titleEn: string;
                descriptionHe: string;
                descriptionEn: string;
                suitableFor: string | null;
                mainUses: string | null;
                condition: import(".prisma/client").$Enums.ListingCondition;
                status: import(".prisma/client").$Enums.ListingStatus;
                basePriceDaily: import("@prisma/client/runtime/library").Decimal;
                depositAmount: import("@prisma/client/runtime/library").Decimal;
                qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
                pickupLat: import("@prisma/client/runtime/library").Decimal;
                pickupLng: import("@prisma/client/runtime/library").Decimal;
                pickupAddressText: string;
                pickupInstructions: string | null;
                deliverySupported: boolean;
                includedItems: import("@prisma/client/runtime/library").JsonValue | null;
                cancellationPolicy: string | null;
                returnTerms: string | null;
                requiresOperator: boolean;
                setupRequired: boolean;
                inventoryCount: number;
                minRentalDays: number;
                maxRentalDays: number;
            };
        } & {
            id: string;
            lenderId: string;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            listingId: string;
            quantity: number;
            bookingId: string;
            itemPrice: import("@prisma/client/runtime/library").Decimal;
            pickupMethod: import(".prisma/client").$Enums.PickupMethod;
            pickupWindow: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        renterId: string;
        bundleCandidateId: string | null;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
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
                city: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                cityId: string | null;
                lenderId: string;
                categoryId: string;
                streetId: string | null;
                addressNumber: number | null;
                titleHe: string;
                titleEn: string;
                descriptionHe: string;
                descriptionEn: string;
                suitableFor: string | null;
                mainUses: string | null;
                condition: import(".prisma/client").$Enums.ListingCondition;
                status: import(".prisma/client").$Enums.ListingStatus;
                basePriceDaily: import("@prisma/client/runtime/library").Decimal;
                depositAmount: import("@prisma/client/runtime/library").Decimal;
                qualityScoreCached: import("@prisma/client/runtime/library").Decimal;
                pickupLat: import("@prisma/client/runtime/library").Decimal;
                pickupLng: import("@prisma/client/runtime/library").Decimal;
                pickupAddressText: string;
                pickupInstructions: string | null;
                deliverySupported: boolean;
                includedItems: import("@prisma/client/runtime/library").JsonValue | null;
                cancellationPolicy: string | null;
                returnTerms: string | null;
                requiresOperator: boolean;
                setupRequired: boolean;
                inventoryCount: number;
                minRentalDays: number;
                maxRentalDays: number;
            };
        } & {
            id: string;
            lenderId: string;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            listingId: string;
            quantity: number;
            bookingId: string;
            itemPrice: import("@prisma/client/runtime/library").Decimal;
            pickupMethod: import(".prisma/client").$Enums.PickupMethod;
            pickupWindow: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        renterId: string;
        bundleCandidateId: string | null;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        totalDeposit: import("@prisma/client/runtime/library").Decimal;
        logisticsScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        reliabilityScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentReference: string | null;
    })[]>;
    updateStatus(user: {
        sub: string;
    }, id: string, dto: UpdateBookingStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        startDate: Date;
        endDate: Date;
        renterId: string;
        bundleCandidateId: string | null;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        totalDeposit: import("@prisma/client/runtime/library").Decimal;
        logisticsScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        reliabilityScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentReference: string | null;
    }>;
}
