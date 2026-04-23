import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("me")
  me(@CurrentUser() user: { sub: string }) {
    return this.notificationsService.me(user.sub);
  }
}
