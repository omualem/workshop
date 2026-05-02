import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Public } from "../../shared/decorators/public.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { AddMediaDto } from "./dto/add-media.dto";
import { AdminCreateListingDto } from "./dto/admin-create-listing.dto";
import { AdminListingQueryDto } from "./dto/admin-listing-query.dto";
import { AdminUpdateListingDto } from "./dto/admin-update-listing.dto";
import { CreateAvailabilityBlockDto } from "./dto/create-availability-block.dto";
import { CreateListingDto } from "./dto/create-listing.dto";
import { CreatePricingRuleDto } from "./dto/create-pricing-rule.dto";
import { ListingQueryDto } from "./dto/listing-query.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { ListingsService } from "./listings.service";

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Public()
  @Get("listings")
  findAll(@Query() query: ListingQueryDto) {
    return this.listingsService.findAll(query);
  }

  // Autocomplete endpoint for the bundle-request builder's "specific listing"
  // mode. MUST be registered before the parameterized "listings/:id" route.
  @Public()
  @Get("listings/search")
  search(@Query("q") q?: string, @Query("limit") limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.listingsService.searchActive(q, parsedLimit);
  }

  @Public()
  @Get("listings/:id")
  findOne(@Param("id") id: string) {
    return this.listingsService.findOne(id);
  }

  @Public()
  @Get("listings/:id/availability")
  availability(
    @Param("id") id: string,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
  ) {
    return this.listingsService.publicAvailability(id, startDate, endDate);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("LENDER")
  @Get("lender/listings")
  lenderListings(@CurrentUser() user: { sub: string }) {
    return this.listingsService.lenderListings(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("LENDER")
  @Post("lender/listings")
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateListingDto) {
    return this.listingsService.create(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("LENDER")
  @Patch("lender/listings/:id")
  update(
    @CurrentUser() user: { sub: string },
    @Param("id") id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(user.sub, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("LENDER")
  @Post("lender/listings/:id/media")
  addMedia(
    @CurrentUser() user: { sub: string },
    @Param("id") id: string,
    @Body() dto: AddMediaDto,
  ) {
    return this.listingsService.addMedia(user.sub, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("LENDER")
  @Post("lender/listings/:id/availability/block")
  addAvailabilityBlock(
    @CurrentUser() user: { sub: string },
    @Param("id") id: string,
    @Body() dto: CreateAvailabilityBlockDto,
  ) {
    return this.listingsService.addAvailabilityBlock(user.sub, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("LENDER")
  @Post("lender/listings/:id/pricing-rules")
  addPricingRule(
    @CurrentUser() user: { sub: string },
    @Param("id") id: string,
    @Body() dto: CreatePricingRuleDto,
  ) {
    return this.listingsService.addPricingRule(user.sub, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("admin/listings")
  adminFindAll(@Query() query: AdminListingQueryDto) {
    return this.listingsService.adminFindAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post("admin/listings")
  adminCreate(@Body() dto: AdminCreateListingDto, @CurrentUser() user: { sub: string }) {
    return this.listingsService.adminCreate(dto, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch("admin/listings/:id")
  adminUpdate(
    @Param("id") id: string,
    @Body() dto: AdminUpdateListingDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.listingsService.adminUpdate(id, dto, user.sub);
  }
}
