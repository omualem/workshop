"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const public_decorator_1 = require("../../shared/decorators/public.decorator");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const add_media_dto_1 = require("./dto/add-media.dto");
const admin_create_listing_dto_1 = require("./dto/admin-create-listing.dto");
const admin_listing_query_dto_1 = require("./dto/admin-listing-query.dto");
const admin_update_listing_dto_1 = require("./dto/admin-update-listing.dto");
const create_availability_block_dto_1 = require("./dto/create-availability-block.dto");
const create_listing_dto_1 = require("./dto/create-listing.dto");
const create_pricing_rule_dto_1 = require("./dto/create-pricing-rule.dto");
const listing_query_dto_1 = require("./dto/listing-query.dto");
const update_listing_dto_1 = require("./dto/update-listing.dto");
const listings_service_1 = require("./listings.service");
let ListingsController = class ListingsController {
    listingsService;
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    findAll(query) {
        return this.listingsService.findAll(query);
    }
    findOne(id) {
        return this.listingsService.findOne(id);
    }
    availability(id, startDate, endDate) {
        return this.listingsService.publicAvailability(id, startDate, endDate);
    }
    lenderListings(user) {
        return this.listingsService.lenderListings(user.sub);
    }
    create(user, dto) {
        return this.listingsService.create(user.sub, dto);
    }
    update(user, id, dto) {
        return this.listingsService.update(user.sub, id, dto);
    }
    addMedia(user, id, dto) {
        return this.listingsService.addMedia(user.sub, id, dto);
    }
    addAvailabilityBlock(user, id, dto) {
        return this.listingsService.addAvailabilityBlock(user.sub, id, dto);
    }
    addPricingRule(user, id, dto) {
        return this.listingsService.addPricingRule(user.sub, id, dto);
    }
    adminFindAll(query) {
        return this.listingsService.adminFindAll(query);
    }
    adminCreate(dto, user) {
        return this.listingsService.adminCreate(dto, user.sub);
    }
    adminUpdate(id, dto, user) {
        return this.listingsService.adminUpdate(id, dto, user.sub);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("listings"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listing_query_dto_1.ListingQueryDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("listings/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("listings/:id/availability"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "availability", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("LENDER"),
    (0, common_1.Get)("lender/listings"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "lenderListings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("LENDER"),
    (0, common_1.Post)("lender/listings"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_listing_dto_1.CreateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("LENDER"),
    (0, common_1.Patch)("lender/listings/:id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_listing_dto_1.UpdateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("LENDER"),
    (0, common_1.Post)("lender/listings/:id/media"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_media_dto_1.AddMediaDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "addMedia", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("LENDER"),
    (0, common_1.Post)("lender/listings/:id/availability/block"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_availability_block_dto_1.CreateAvailabilityBlockDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "addAvailabilityBlock", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("LENDER"),
    (0, common_1.Post)("lender/listings/:id/pricing-rules"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_pricing_rule_dto_1.CreatePricingRuleDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "addPricingRule", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("admin/listings"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_listing_query_dto_1.AdminListingQueryDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "adminFindAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("admin/listings"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_create_listing_dto_1.AdminCreateListingDto, Object]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "adminCreate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Patch)("admin/listings/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_update_listing_dto_1.AdminUpdateListingDto, Object]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "adminUpdate", null);
exports.ListingsController = ListingsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map