"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const addresses_module_1 = require("./modules/addresses/addresses.module");
const audit_module_1 = require("./modules/audit/audit.module");
const auth_module_1 = require("./modules/auth/auth.module");
const availability_module_1 = require("./modules/availability/availability.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const bundle_optimizer_module_1 = require("./modules/bundle-optimizer/bundle-optimizer.module");
const categories_module_1 = require("./modules/categories/categories.module");
const health_module_1 = require("./modules/health/health.module");
const listings_module_1 = require("./modules/listings/listings.module");
const pricing_module_1 = require("./modules/pricing/pricing.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const renters_module_1 = require("./modules/renters/renters.module");
const lenders_module_1 = require("./modules/lenders/lenders.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const users_module_1 = require("./modules/users/users.module");
const admin_module_1 = require("./modules/admin/admin.module");
const prisma_module_1 = require("./prisma/prisma.module");
const env_config_1 = require("./shared/config/env.config");
const request_context_middleware_1 = require("./shared/middleware/request-context.middleware");
const redis_module_1 = require("./shared/redis/redis.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_context_middleware_1.RequestContextMiddleware).forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: env_config_1.validateEnv,
                cache: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60_000,
                    limit: 120,
                },
            ]),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            renters_module_1.RentersModule,
            lenders_module_1.LendersModule,
            addresses_module_1.AddressesModule,
            categories_module_1.CategoriesModule,
            listings_module_1.ListingsModule,
            availability_module_1.AvailabilityModule,
            pricing_module_1.PricingModule,
            bookings_module_1.BookingsModule,
            reviews_module_1.ReviewsModule,
            notifications_module_1.NotificationsModule,
            bundle_optimizer_module_1.BundleOptimizerModule,
            audit_module_1.AuditModule,
            admin_module_1.AdminModule,
            health_module_1.HealthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map