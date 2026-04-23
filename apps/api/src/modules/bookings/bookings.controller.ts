import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";
import { BookingsService } from "./bookings.service";

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles("RENTER")
  @Post("bookings")
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(user.sub, dto);
  }

  @Roles("RENTER")
  @Get("renters/me/bookings")
  renterBookings(@CurrentUser() user: { sub: string }) {
    return this.bookingsService.renterBookings(user.sub);
  }

  @Roles("LENDER")
  @Get("lenders/me/bookings")
  lenderBookings(@CurrentUser() user: { sub: string }) {
    return this.bookingsService.lenderBookings(user.sub);
  }

  @Roles("LENDER")
  @Patch("lenders/me/bookings/:id/status")
  updateStatus(
    @CurrentUser() user: { sub: string },
    @Param("id") id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateLenderBookingStatus(user.sub, id, dto);
  }
}
