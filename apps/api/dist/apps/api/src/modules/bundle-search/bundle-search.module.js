"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleSearchModule = void 0;
const common_1 = require("@nestjs/common");
const availability_module_1 = require("../availability/availability.module");
const pricing_module_1 = require("../pricing/pricing.module");
const bundle_explanation_service_1 = require("./bundle-explanation.service");
const bundle_generation_service_1 = require("./bundle-generation.service");
const bundle_scoring_service_1 = require("./bundle-scoring.service");
const bundle_search_controller_1 = require("./bundle-search.controller");
const bundle_search_service_1 = require("./bundle-search.service");
const lender_reliability_service_1 = require("./lender-reliability.service");
const ranking_config_service_1 = require("./ranking-config.service");
let BundleSearchModule = class BundleSearchModule {
};
exports.BundleSearchModule = BundleSearchModule;
exports.BundleSearchModule = BundleSearchModule = __decorate([
    (0, common_1.Module)({
        imports: [availability_module_1.AvailabilityModule, pricing_module_1.PricingModule],
        controllers: [bundle_search_controller_1.BundleSearchController],
        providers: [
            bundle_search_service_1.BundleSearchService,
            ranking_config_service_1.RankingConfigService,
            lender_reliability_service_1.LenderReliabilityService,
            bundle_generation_service_1.BundleGenerationService,
            bundle_scoring_service_1.BundleScoringService,
            bundle_explanation_service_1.BundleExplanationService,
        ],
        exports: [bundle_search_service_1.BundleSearchService, ranking_config_service_1.RankingConfigService],
    })
], BundleSearchModule);
//# sourceMappingURL=bundle-search.module.js.map