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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const update_ranking_config_dto_1 = require("./dto/update-ranking-config.dto");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    bundleSearchDebug(id) {
        return this.adminService.bundleSearchDebug(id);
    }
    updateRankingConfig(user, dto) {
        return this.adminService.updateRankingConfig(user.sub, dto);
    }
    auditLogs() {
        return this.adminService.auditLogs();
    }
    overview() {
        return this.adminService.overview();
    }
    catalogOptions() {
        return this.adminService.catalogOptions();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("bundle-search/:id/debug"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "bundleSearchDebug", null);
__decorate([
    (0, common_1.Patch)("ranking-config"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_ranking_config_dto_1.UpdateRankingConfigDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateRankingConfig", null);
__decorate([
    (0, common_1.Get)("audit-logs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "auditLogs", null);
__decorate([
    (0, common_1.Get)("overview"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("catalog/options"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "catalogOptions", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map