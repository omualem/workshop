import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Public } from "../../shared/decorators/public.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { CreateCategoryDto } from "../categories/dto/create-category.dto";
import { UpdateCategoryDto } from "../categories/dto/update-category.dto";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import { AdminService } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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

  @Get("categories")
  @Public()
  categories(@Query("includeArchived") includeArchived?: string) {
    return this.adminService.adminCategories(includeArchived === "true");
  }

  @Post("categories")
  @Public()
  createCategory(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user?: { sub: string },
  ) {
    return this.adminService.adminCreateCategory(dto, user?.sub);
  }

  @Patch("categories/:id")
  @Public()
  updateCategory(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user?: { sub: string },
  ) {
    return this.adminService.adminUpdateCategory(id, dto, user?.sub);
  }

  @Delete("categories/:id")
  @Public()
  async deleteCategory(
    @Param("id") id: string,
    @CurrentUser() user?: { sub: string },
  ) {
    const data = await this.adminService.adminDeleteCategory(id, user?.sub);
    return { success: true, data };
  }

  @Get("users")
  @Public()
  users(@Query("includeDeleted") includeDeleted?: string) {
    return this.adminService.users(includeDeleted === "true");
  }

  @Post("users")
  @Public()
  createUser(
    @Body() dto: UpdateAdminUserDto,
    @CurrentUser() user?: { sub: string },
  ) {
    return this.adminService.createUser(dto, user?.sub);
  }

  @Patch("users/:id")
  @Public()
  updateUser(
    @Param("id") id: string,
    @Body() dto: UpdateAdminUserDto,
    @CurrentUser() user?: { sub: string },
  ) {
    return this.adminService.updateUser(id, dto, user?.sub);
  }

  @Delete("users/:id")
  @Public()
  async deleteUser(@Param("id") id: string, @CurrentUser() user?: { sub: string }) {
    const data = await this.adminService.deleteUser(id, user?.sub);
    return { success: true, data };
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

}
