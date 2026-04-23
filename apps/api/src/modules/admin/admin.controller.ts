import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
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
  auditLogs() {
    return this.adminService.auditLogs();
  }

  @Get("overview")
  overview() {
    return this.adminService.overview();
  }

  @Get("catalog/options")
  catalogOptions() {
    return this.adminService.catalogOptions();
  }
}
