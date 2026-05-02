"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParetoFilterService = void 0;
const common_1 = require("@nestjs/common");
let ParetoFilterService = class ParetoFilterService {
    filter(bundles) {
        const kept = [];
        for (const candidate of bundles) {
            const dominated = bundles.some((other) => other !== candidate && this.dominates(other, candidate));
            if (!dominated)
                kept.push(candidate);
        }
        return { kept, removedCount: bundles.length - kept.length };
    }
    dominates(a, b) {
        const dims = [
            "price",
            "distance",
            "reliability",
            "condition",
            "availability",
        ];
        let strictlyBetter = false;
        for (const j of dims) {
            const va = a.metrics[j];
            const vb = b.metrics[j];
            if (va < vb)
                return false;
            if (va > vb)
                strictlyBetter = true;
        }
        return strictlyBetter;
    }
};
exports.ParetoFilterService = ParetoFilterService;
exports.ParetoFilterService = ParetoFilterService = __decorate([
    (0, common_1.Injectable)()
], ParetoFilterService);
//# sourceMappingURL=pareto-filter.service.js.map