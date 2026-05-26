import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { normalizeDecimalObject, decimalToNumber } from "../../shared/utils/prisma.utils";
import { AuditService } from "../audit/audit.service";
import { AvailabilityService } from "../availability/availability.service";
import { PricingService } from "../pricing/pricing.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
    private readonly pricingService: PricingService,
    private readonly auditService: AuditService,
  ) {}

  async create(renterId: string, dto: CreateBookingDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    const listings = await this.prisma.listing.findMany({
      where: {
        id: { in: dto.items.map((item) => item.listingId) },
      },
      include: {
        pricingRules: true,
      },
    });

    if (listings.length !== dto.items.length) {
      throw new NotFoundException("One or more listings were not found");
    }

    for (const item of dto.items) {
      const listing = listings.find((entry: (typeof listings)[number]) => entry.id === item.listingId)!;
      const available = await this.availabilityService.isListingAvailable(
        item.listingId,
        item.quantity,
        startDate,
        endDate,
        listing.inventoryCount,
      );

      if (!available) {
        throw new ForbiddenException(`Listing ${item.listingId} is not available`);
      }
    }

    const pricedItems = dto.items.map((item) => {
      const listing = listings.find((entry: (typeof listings)[number]) => entry.id === item.listingId)!;
      const price = this.pricingService.computeListingPrice(listing, startDate, endDate, item.quantity);
      return {
        listing,
        item,
        price,
      };
    });

    const computedTotalPrice = pricedItems.reduce((sum, entry) => sum + entry.price.total, 0);
    const computedTotalDeposit = pricedItems.reduce(
      (sum, entry) => sum + decimalToNumber(entry.listing.depositAmount)! * entry.item.quantity,
      0,
    );

    const booking = await this.prisma.$transaction(async (tx: any) => {
      for (const entry of pricedItems) {
        const [bookedItems, blockedItems] = await Promise.all([
          tx.bookingItem.findMany({
            where: {
              listingId: entry.listing.id,
              booking: {
                status: {
                  in: ["PENDING", "APPROVED", "CONFIRMED", "IN_PROGRESS"],
                },
                startDate: { lt: endDate },
                endDate: { gt: startDate },
              },
            },
            select: { quantity: true },
          }),
          tx.listingAvailabilityBlock.findMany({
            where: {
              listingId: entry.listing.id,
              startDate: { lt: endDate },
              endDate: { gt: startDate },
              status: {
                in: ["BLOCKED", "BOOKED", "MAINTENANCE"],
              },
            },
            select: { quantity: true },
          }),
        ]);

        const bookedQuantity = bookedItems.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0,
        );
        const blockedQuantity = blockedItems.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0,
        );

        if (bookedQuantity + blockedQuantity + entry.item.quantity > entry.listing.inventoryCount) {
          throw new ForbiddenException(`Listing ${entry.listing.id} became unavailable`);
        }
      }

      const created = await tx.booking.create({
        data: {
          renterId,
          startDate,
          endDate,
          totalPrice: computedTotalPrice,
          totalDeposit: dto.totalDeposit ?? computedTotalDeposit,
          logisticsScoreSnapshot: 0,
          reliabilityScoreSnapshot: 0,
          items: {
            create: pricedItems.map((entry) => ({
              listingId: entry.listing.id,
              lenderId: entry.listing.lenderId,
              quantity: entry.item.quantity,
              itemPrice: entry.price.total,
              depositAmount: decimalToNumber(entry.listing.depositAmount)! * entry.item.quantity,
              pickupMethod: entry.item.pickupMethod,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return created;
    });

    await this.auditService.log({
      actorUserId: renterId,
      action: "booking.create",
      entityType: "Booking",
      entityId: booking.id,
      after: booking,
    });

    return normalizeDecimalObject(booking);
  }

  async renterBookings(renterId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { renterId },
      include: {
        items: {
          include: {
            listing: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return bookings.map((booking: (typeof bookings)[number]) => normalizeDecimalObject(booking));
  }

  async lenderBookings(lenderId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        items: {
          some: {
            lenderId,
          },
        },
      },
      include: {
        renter: {
          select: { id: true, fullName: true, email: true },
        },
        items: {
          where: { lenderId },
          include: {
            listing: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return bookings.map((booking: (typeof bookings)[number]) => normalizeDecimalObject(booking));
  }

  async updateLenderBookingStatus(lenderId: string, bookingId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        items: true,
      },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    const ownsAnyItem = booking.items.some((item: { lenderId: string }) => item.lenderId === lenderId);

    if (!ownsAnyItem) {
      throw new ForbiddenException("Booking does not belong to current lender");
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: dto.status as any,
      },
    });

    await this.auditService.log({
      actorUserId: lenderId,
      action: "booking.status.update",
      entityType: "Booking",
      entityId: bookingId,
      before: booking,
      after: updated,
    });

    return normalizeDecimalObject(updated);
  }
}
