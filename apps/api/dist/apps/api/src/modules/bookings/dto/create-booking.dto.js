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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class BookingItemInputDto {
    listingId;
    quantity;
    pickupMethod;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingItemInputDto.prototype, "listingId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], BookingItemInputDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["PICKUP", "DELIVERY", "HYBRID"]),
    __metadata("design:type", String)
], BookingItemInputDto.prototype, "pickupMethod", void 0);
class CreateBookingDto {
    bundleCandidateId;
    startDate;
    endDate;
    totalPrice;
    totalDeposit;
    items;
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "bundleCandidateId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "totalPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "totalDeposit", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BookingItemInputDto),
    __metadata("design:type", Array)
], CreateBookingDto.prototype, "items", void 0);
//# sourceMappingURL=create-booking.dto.js.map