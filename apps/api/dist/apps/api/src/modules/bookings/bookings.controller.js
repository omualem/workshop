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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const update_booking_status_dto_1 = require("./dto/update-booking-status.dto");
const bookings_service_1 = require("./bookings.service");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    create(user, dto) {
        return this.bookingsService.create(user.sub, dto);
    }
    renterBookings(user) {
        return this.bookingsService.renterBookings(user.sub);
    }
    lenderBookings(user) {
        return this.bookingsService.lenderBookings(user.sub);
    }
    updateStatus(user, id, dto) {
        return this.bookingsService.updateLenderBookingStatus(user.sub, id, dto);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, roles_decorator_1.Roles)("RENTER"),
    (0, common_1.Post)("bookings"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)("RENTER"),
    (0, common_1.Get)("renters/me/bookings"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "renterBookings", null);
__decorate([
    (0, roles_decorator_1.Roles)("LENDER"),
    (0, common_1.Get)("lenders/me/bookings"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "lenderBookings", null);
__decorate([
    (0, roles_decorator_1.Roles)("LENDER"),
    (0, common_1.Patch)("lenders/me/bookings/:id/status"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_booking_status_dto_1.UpdateBookingStatusDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "updateStatus", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map