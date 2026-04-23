import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { Public } from "../../shared/decorators/public.decorator";
import { Roles } from "../../shared/decorators/roles.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { RolesGuard } from "../../shared/guards/roles.guard";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("admin/manage")
  findAllAdmin() {
    return this.categoriesService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post("admin/manage")
  create(@Body() dto: CreateCategoryDto, @CurrentUser() user: { sub: string }) {
    return this.categoriesService.create(dto, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch("admin/manage/:id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.categoriesService.update(id, dto, user.sub);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }
}
