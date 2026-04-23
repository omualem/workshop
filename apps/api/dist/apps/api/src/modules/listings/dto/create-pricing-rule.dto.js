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
exports.CreatePricingRuleDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePricingRuleDto {
    ruleType;
    minDays;
    maxDays;
    percentDiscount;
    fixedOverride;
    weekendAdjustment;
    seasonalAdjustment;
    startsAt;
    endsAt;
}
exports.CreatePricingRuleDto = CreatePricingRuleDto;
__decorate([
    (0, class_validator_1.IsIn)([
        "DURATION_DISCOUNT",
        "FIXED_OVERRIDE",
        "WEEKEND_ADJUSTMENT",
        "SEASONAL_ADJUSTMENT",
    ]),
    __metadata("design:type", String)
], CreatePricingRuleDto.prototype, "ruleType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePricingRuleDto.prototype, "minDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePricingRuleDto.prototype, "maxDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePricingRuleDto.prototype, "percentDiscount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePricingRuleDto.prototype, "fixedOverride", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePricingRuleDto.prototype, "weekendAdjustment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePricingRuleDto.prototype, "seasonalAdjustment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePricingRuleDto.prototype, "startsAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePricingRuleDto.prototype, "endsAt", void 0);
//# sourceMappingURL=create-pricing-rule.dto.js.map