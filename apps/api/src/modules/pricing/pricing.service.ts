import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { decimalToNumber } from "../../shared/utils/prisma.utils";

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  calculateRentalDays(startDate: Date, endDate: Date) {
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
  }

  async calculateListingPrice(listingId: string, startDate: Date, endDate: Date, quantity = 1) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { pricingRules: true },
    });

    if (!listing) {
      return null;
    }

    return this.computeListingPrice(listing, startDate, endDate, quantity);
  }

  computeListingPrice(
    listing: {
      basePriceDaily: any;
      pricingRules: Array<{
        ruleType: string;
        minDays: number | null;
        maxDays: number | null;
        percentDiscount: any;
        fixedOverride: any;
        weekendAdjustment: any;
        seasonalAdjustment: any;
      }>;
    },
    startDate: Date,
    endDate: Date,
    quantity = 1,
  ) {
    const days = this.calculateRentalDays(startDate, endDate);
    let baseTotal = decimalToNumber(listing.basePriceDaily)! * days * quantity;

    for (const rule of listing.pricingRules) {
      const withinDuration =
        (!rule.minDays || days >= rule.minDays) && (!rule.maxDays || days <= rule.maxDays);

      if (!withinDuration) {
        continue;
      }

      if (rule.ruleType === "FIXED_OVERRIDE" && rule.fixedOverride) {
        baseTotal = decimalToNumber(rule.fixedOverride)! * days * quantity;
      }

      if (rule.percentDiscount) {
        baseTotal *= 1 - decimalToNumber(rule.percentDiscount)! / 100;
      }

      if (rule.weekendAdjustment) {
        baseTotal *= 1 + decimalToNumber(rule.weekendAdjustment)! / 100;
      }

      if (rule.seasonalAdjustment) {
        baseTotal *= 1 + decimalToNumber(rule.seasonalAdjustment)! / 100;
      }
    }

    return {
      days,
      total: Number(baseTotal.toFixed(2)),
      perDay: Number((baseTotal / days).toFixed(2)),
    };
  }
}
