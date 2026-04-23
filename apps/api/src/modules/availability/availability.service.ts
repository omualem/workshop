import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookedQuantity(listingId: string, startDate: Date, endDate: Date) {
    const bookingItems = await this.prisma.bookingItem.findMany({
      where: {
        listingId,
        booking: {
          status: {
            in: ["PENDING", "APPROVED", "CONFIRMED", "IN_PROGRESS"],
          },
          startDate: { lt: endDate },
          endDate: { gt: startDate },
        },
      },
      select: {
        quantity: true,
      },
    });

    return bookingItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
  }

  async getBlockedQuantity(listingId: string, startDate: Date, endDate: Date) {
    const blocks = await this.prisma.listingAvailabilityBlock.findMany({
      where: {
        listingId,
        startDate: { lt: endDate },
        endDate: { gt: startDate },
        status: {
          in: ["BLOCKED", "BOOKED", "MAINTENANCE"],
        },
      },
      select: {
        quantity: true,
      },
    });

    return blocks.reduce((sum: number, block: { quantity: number }) => sum + block.quantity, 0);
  }

  async isListingAvailable(
    listingId: string,
    quantity: number,
    startDate: Date,
    endDate: Date,
    inventoryCount?: number,
  ) {
    const listing =
      inventoryCount !== undefined
        ? { inventoryCount }
        : await this.prisma.listing.findUnique({
            where: { id: listingId },
            select: { inventoryCount: true },
          });

    if (!listing) {
      return false;
    }

    const [bookedQuantity, blockedQuantity] = await Promise.all([
      this.getBookedQuantity(listingId, startDate, endDate),
      this.getBlockedQuantity(listingId, startDate, endDate),
    ]);

    return bookedQuantity + blockedQuantity + quantity <= listing.inventoryCount;
  }

  async availabilityFragilityScore(listingId: string, startDate: Date, endDate: Date) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { inventoryCount: true },
    });

    if (!listing) {
      return 0;
    }

    const [bookedQuantity, blockedQuantity] = await Promise.all([
      this.getBookedQuantity(listingId, startDate, endDate),
      this.getBlockedQuantity(listingId, startDate, endDate),
    ]);

    const remaining = Math.max(0, listing.inventoryCount - bookedQuantity - blockedQuantity);
    return Math.max(0, Math.min(10, (remaining / Math.max(1, listing.inventoryCount)) * 10));
  }
}
