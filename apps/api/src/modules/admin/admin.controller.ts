import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Public } from "../../shared/decorators/public.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { UpdateRankingConfigDto } from "./dto/update-ranking-config.dto";
import { AdminService } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("bundle-search/:id/debug")
  bundleSearchDebug(@Param("id") id: string) {
    return this.adminService.bundleSearchDebug(id);
  }

  @Patch("ranking-config")
  updateRankingConfig(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateRankingConfigDto,
  ) {
    return this.adminService.updateRankingConfig(user.sub, dto);
  }

  @Get("audit-logs")
  @Public()
  auditLogs() {
    return this.adminService.auditLogs();
  }

  @Get("overview")
  @Public()
  overview() {
    return this.adminService.overview();
  }

  @Get("catalog/options")
  @Public()
  catalogOptions() {
    return this.adminService.catalogOptions();
  }

  @Get("users")
  @Public()
  users() {
    return this.adminService.users();
  }

  @Get("moderation")
  @Public()
  moderationQueue() {
    return this.adminService.moderationQueue();
  }

  @Get("bookings")
  @Public()
  bookings() {
    return this.adminService.bookings();
  }

  @Get("disputes")
  @Public()
  disputes() {
    return this.adminService.disputes();
  }

  @Get("reviews")
  @Public()
  reviews() {
    return this.adminService.reviews();
  }

  @Get("ranking-config")
  @Public()
  rankingConfig() {
    return this.adminService.rankingConfig();
  }
}
