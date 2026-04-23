import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@CurrentUser() user: { sub: string }) {
    return this.usersService.getMe(user.sub);
  }
}
