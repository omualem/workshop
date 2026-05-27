"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ListingRatingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingRatingService = void 0;
const common_1 = require("@nestjs/common");
let ListingRatingService = class ListingRatingService {
    static { ListingRatingService_1 = this; }
    static K = 30;
    static PRIOR = 3.7;
    compute(input) {
        const v = Math.max(0, Math.floor(input.distinctRaterCount));
        const g = clamp(input.averageRating, 0, 5);
        if (v === 0) {
            return {
                distinctRaterCount: 0,
                averageRating: 0,
                confidence: 0,
                adjustedRating: ListingRatingService_1.PRIOR,
                itemRatingScore: null,
                insufficient: true,
            };
        }
        const c = Math.min(1, v / ListingRatingService_1.K);
        const adjustedRating = g * c + ListingRatingService_1.PRIOR * (1 - c);
        const itemRatingScore = clamp(2 * adjustedRating, 0, 10);
        return {
            distinctRaterCount: v,
            averageRating: g,
            confidence: c,
            adjustedRating,
            itemRatingScore,
            insufficient: false,
        };
    }
};
exports.ListingRatingService = ListingRatingService;
exports.ListingRatingService = ListingRatingService = ListingRatingService_1 = __decorate([
    (0, common_1.Injectable)()
], ListingRatingService);
function clamp(value, lo, hi) {
    if (Number.isNaN(value))
        return lo;
    return Math.max(lo, Math.min(hi, value));
}
//# sourceMappingURL=listing-rating.service.js.map