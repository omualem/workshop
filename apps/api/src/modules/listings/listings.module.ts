import { Module } from "@nestjs/common";
import { AddressesModule } from "../addresses/addresses.module";
import { AuditModule } from "../audit/audit.module";
import { AvailabilityModule } from "../availability/availability.module";
import { ListingsController } from "./listings.controller";
import { ListingsService } from "./listings.service";

@Module({
  imports: [AuditModule, AvailabilityModule, AddressesModule],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
