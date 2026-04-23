import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../shared/redis/redis.service";
import { Public } from "../../shared/decorators/public.decorator";

@Controller("health")
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Public()
  @Get()
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
      database: "ok",
      redis: await this.redisService.ping(),
      timestamp: new Date().toISOString(),
    };
  }
}
