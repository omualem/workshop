import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AvailabilityModule } from "./modules/availability/availability.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { BundleSearchModule } from "./modules/bundle-search/bundle-search.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { HealthModule } from "./modules/health/health.module";
import { ListingsModule } from "./modules/listings/listings.module";
import { PricingModule } from "./modules/pricing/pricing.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { RentersModule } from "./modules/renters/renters.module";
import { LendersModule } from "./modules/lenders/lenders.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { UsersModule } from "./modules/users/users.module";
import { AdminModule } from "./modules/admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";
import { envSchema, validateEnv } from "./shared/config/env.config";
import { RequestContextMiddleware } from "./shared/middleware/request-context.middleware";
import { RedisModule } from "./shared/redis/redis.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      cache: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    RentersModule,
    LendersModule,
    CategoriesModule,
    ListingsModule,
    AvailabilityModule,
    PricingModule,
    BookingsModule,
    ReviewsModule,
    NotificationsModule,
    BundleSearchModule,
    AuditModule,
    AdminModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
