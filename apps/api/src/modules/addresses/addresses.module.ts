import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AddressesController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";
import { GeocodingService } from "./geocoding.service";

@Module({
  imports: [PrismaModule],
  controllers: [AddressesController],
  providers: [AddressesService, GeocodingService],
  exports: [AddressesService, GeocodingService],
})
export class AddressesModule {}
