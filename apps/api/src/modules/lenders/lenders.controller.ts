import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { UpdateLenderProfileDto } from "./dto/update-lender-profile.dto";
import { LendersService } from "./lenders.service";

@Controller("lenders")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("LENDER")
export class LendersController {
  constructor(private readonly lendersService: LendersService) {}

  @Get("me/profile")
  me(@CurrentUser() user: { sub: string }) {
    return this.lendersService.me(user.sub);
  }

  @Patch("me/profile")
  update(@CurrentUser() user: { sub: string }, @Body() dto: UpdateLenderProfileDto) {
    return this.lendersService.update(user.sub, dto);
  }
}
