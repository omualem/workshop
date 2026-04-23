import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Public } from "../../shared/decorators/public.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewsService } from "./reviews.service";

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("RENTER")
  @Post("reviews")
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.sub, dto);
  }

  @Public()
  @Get("lenders/:id/reviews")
  lenderReviews(@Param("id") id: string) {
    return this.reviewsService.lenderReviews(id);
  }
}
