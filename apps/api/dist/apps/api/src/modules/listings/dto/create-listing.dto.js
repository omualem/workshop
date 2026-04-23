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
exports.CreateListingDto = void 0;
const class_validator_1 = require("class-validator");
class CreateListingDto {
    categoryId;
    titleHe;
    titleEn;
    descriptionHe;
    descriptionEn;
    condition;
    basePriceDaily;
    depositAmount;
    pickupLat;
    pickupLng;
    pickupAddressText;
    deliverySupported;
    inventoryCount;
    minRentalDays;
    maxRentalDays;
    attributeValues;
}
exports.CreateListingDto = CreateListingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CreateListingDto.prototype, "titleHe", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CreateListingDto.prototype, "titleEn", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateListingDto.prototype, "descriptionHe", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateListingDto.prototype, "descriptionEn", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["NEW", "LIKE_NEW", "GOOD", "FAIR", "HEAVY_USE"]),
    __metadata("design:type", String)
], CreateListingDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "basePriceDaily", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "depositAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "pickupLat", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "pickupLng", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    __metadata("design:type", String)
], CreateListingDto.prototype, "pickupAddressText", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateListingDto.prototype, "deliverySupported", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "inventoryCount", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "minRentalDays", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "maxRentalDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateListingDto.prototype, "attributeValues", void 0);
//# sourceMappingURL=create-listing.dto.js.map