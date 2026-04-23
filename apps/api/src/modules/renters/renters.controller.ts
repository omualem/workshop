import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { RentersService } from "./renters.service";

@Controller("renters")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("RENTER")
export class RentersController {
  constructor(private readonly rentersService: RentersService) {}

  @Get("me/profile")
  me(@CurrentUser() user: { sub: string }) {
    return this.rentersService.me(user.sub);
  }

  @Get("me/saved-searches")
  savedSearches(@CurrentUser() user: { sub: string }) {
    return this.rentersService.savedSearches(user.sub);
  }

  @Get("me/favorites")
  favorites(@CurrentUser() user: { sub: string }) {
    return this.rentersService.favorites(user.sub);
  }
}
