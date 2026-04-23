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
exports.BundleSearchController = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("@rental/types");
const public_decorator_1 = require("../../shared/decorators/public.decorator");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const zod_validation_pipe_1 = require("../../shared/pipes/zod-validation.pipe");
const bundle_search_service_1 = require("./bundle-search.service");
let BundleSearchController = class BundleSearchController {
    bundleSearchService;
    constructor(bundleSearchService) {
        this.bundleSearchService = bundleSearchService;
    }
    create(body, user) {
        return this.bundleSearchService.create(body, user?.sub);
    }
    getSearch(id) {
        return this.bundleSearchService.getSearch(id);
    }
    getResults(id) {
        return this.bundleSearchService.getResults(id);
    }
    recompute(id) {
        return this.bundleSearchService.recompute(id);
    }
};
exports.BundleSearchController = BundleSearchController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(types_1.bundleSearchInputSchema))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BundleSearchController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BundleSearchController.prototype, "getSearch", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(":id/results"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BundleSearchController.prototype, "getResults", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(":id/recompute"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BundleSearchController.prototype, "recompute", null);
exports.BundleSearchController = BundleSearchController = __decorate([
    (0, common_1.Controller)("bundle-search"),
    __metadata("design:paramtypes", [bundle_search_service_1.BundleSearchService])
], BundleSearchController);
//# sourceMappingURL=bundle-search.controller.js.map