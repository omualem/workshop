"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleOptimizerModule = void 0;
const common_1 = require("@nestjs/common");
const addresses_module_1 = require("../addresses/addresses.module");
const availability_module_1 = require("../availability/availability.module");
const pricing_module_1 = require("../pricing/pricing.module");
const lender_reliability_service_1 = require("./lender-reliability.service");
const beam_search_service_1 = require("./beam-search.service");
const bundle_explanation_service_1 = require("./bundle-explanation.service");
const bundle_optimizer_controller_1 = require("./bundle-optimizer.controller");
const bundle_optimizer_service_1 = require("./bundle-optimizer.service");
const bundle_scoring_service_1 = require("./bundle-scoring.service");
const candidate_filter_service_1 = require("./candidate-filter.service");
const metric_normalization_service_1 = require("./metric-normalization.service");
const pareto_filter_service_1 = require("./pareto-filter.service");
const preference_mapping_service_1 = require("./preference-mapping.service");
let BundleOptimizerModule = class BundleOptimizerModule {
};
exports.BundleOptimizerModule = BundleOptimizerModule;
exports.BundleOptimizerModule = BundleOptimizerModule = __decorate([
    (0, common_1.Module)({
        imports: [availability_module_1.AvailabilityModule, pricing_module_1.PricingModule, addresses_module_1.AddressesModule],
        controllers: [bundle_optimizer_controller_1.BundleOptimizerController],
        providers: [
            bundle_optimizer_service_1.BundleOptimizerService,
            candidate_filter_service_1.CandidateFilterService,
            metric_normalization_service_1.MetricNormalizationService,
            bundle_scoring_service_1.BundleScoringService,
            beam_search_service_1.BeamSearchService,
            pareto_filter_service_1.ParetoFilterService,
            bundle_explanation_service_1.BundleExplanationService,
            preference_mapping_service_1.PreferenceMappingService,
            lender_reliability_service_1.LenderReliabilityService,
        ],
        exports: [bundle_optimizer_service_1.BundleOptimizerService],
    })
], BundleOptimizerModule);
//# sourceMappingURL=bundle-optimizer.module.js.map