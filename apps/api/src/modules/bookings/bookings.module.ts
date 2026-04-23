import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { AvailabilityModule } from "../availability/availability.module";
import { PricingModule } from "../pricing/pricing.module";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";

@Module({
  imports: [AvailabilityModule, PricingModule, AuditModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
