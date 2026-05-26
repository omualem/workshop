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
const public_decorator_1 = require("../../shared/decorators/public.decorator");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const create_category_dto_1 = require("../categories/dto/create-category.dto");
const update_category_dto_1 = require("../categories/dto/update-category.dto");
const update_admin_user_dto_1 = require("./dto/update-admin-user.dto");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
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
    categories(includeArchived) {
        return this.adminService.adminCategories(includeArchived === "true");
    }
    createCategory(dto, user) {
        return this.adminService.adminCreateCategory(dto, user?.sub);
    }
    updateCategory(id, dto, user) {
        return this.adminService.adminUpdateCategory(id, dto, user?.sub);
    }
    async deleteCategory(id, user) {
        const data = await this.adminService.adminDeleteCategory(id, user?.sub);
        return { success: true, data };
    }
    users(includeDeleted) {
        return this.adminService.users(includeDeleted === "true");
    }
    createUser(dto, user) {
        return this.adminService.createUser(dto, user?.sub);
    }
    updateUser(id, dto, user) {
        return this.adminService.updateUser(id, dto, user?.sub);
    }
    async deleteUser(id, user) {
        const data = await this.adminService.deleteUser(id, user?.sub);
        return { success: true, data };
    }
    moderationQueue() {
        return this.adminService.moderationQueue();
    }
    bookings() {
        return this.adminService.bookings();
    }
    disputes() {
        return this.adminService.disputes();
    }
    reviews() {
        return this.adminService.reviews();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("audit-logs"),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "auditLogs", null);
__decorate([
    (0, common_1.Get)("overview"),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("catalog/options"),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "catalogOptions", null);
__decorate([
    (0, common_1.Get)("categories"),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)("includeArchived")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "categories", null);
__decorate([
    (0, common_1.Post)("categories"),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)("categories/:id"),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)("categories/:id"),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)("users"),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)("includeDeleted")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "users", null);
__decorate([
    (0, common_1.Post)("users"),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_admin_user_dto_1.UpdateAdminUserDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)("users/:id"),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_user_dto_1.UpdateAdminUserDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)("users/:id"),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)("moderation"),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "moderationQueue", null);
__decorate([
    (0, common_1.Get)("bookings"),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "bookings", null);
__decorate([
    (0, common_1.Get)("disputes"),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "disputes", null);
__decorate([
    (0, common_1.Get)("reviews"),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "reviews", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map