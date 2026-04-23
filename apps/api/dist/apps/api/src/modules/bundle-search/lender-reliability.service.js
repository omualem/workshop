"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LenderReliabilityService = void 0;
const common_1 = require("@nestjs/common");
let LenderReliabilityService = class LenderReliabilityService {
    compute(input) {
        const sampleWeight = Math.min(1, input.completedTransactionsCount / 25);
        const bayesianRating = input.averageRating * sampleWeight + 4.2 * (1 - sampleWeight);
        const ratingNormalized = (bayesianRating / 5) * 10;
        const completionRateNormalized = Math.max(0, 10 - (input.cancellationRate + input.lateReturnRate + input.complaintRate) * 0.18);
        const verificationBonus = input.verificationLevel === "TRUSTED"
            ? 1.2
            : input.verificationLevel === "VERIFIED"
                ? 0.6
                : 0;
        const responseBonus = Math.max(0, Math.min(1.2, input.responseTimeScore / 10));
        return Math.max(0, Math.min(10, ratingNormalized * 0.42 +
            completionRateNormalized * 0.38 +
            verificationBonus +
            responseBonus));
    }
};
exports.LenderReliabilityService = LenderReliabilityService;
exports.LenderReliabilityService = LenderReliabilityService = __decorate([
    (0, common_1.Injectable)()
], LenderReliabilityService);
//# sourceMappingURL=lender-reliability.service.js.map