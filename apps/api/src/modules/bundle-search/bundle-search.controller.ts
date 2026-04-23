import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { bundleSearchInputSchema } from "@rental/types";
import { Public } from "../../shared/decorators/public.decorator";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { ZodValidationPipe } from "../../shared/pipes/zod-validation.pipe";
import { BundleSearchService } from "./bundle-search.service";

@Controller("bundle-search")
export class BundleSearchController {
  constructor(private readonly bundleSearchService: BundleSearchService) {}

  @Public()
  @Post()
  create(
    @Body(new ZodValidationPipe(bundleSearchInputSchema)) body: any,
    @CurrentUser() user?: { sub: string },
  ) {
    return this.bundleSearchService.create(body, user?.sub);
  }

  @Public()
  @Get(":id")
  getSearch(@Param("id") id: string) {
    return this.bundleSearchService.getSearch(id);
  }

  @Public()
  @Get(":id/results")
  getResults(@Param("id") id: string) {
    return this.bundleSearchService.getResults(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post(":id/recompute")
  recompute(@Param("id") id: string) {
    return this.bundleSearchService.recompute(id);
  }
}
