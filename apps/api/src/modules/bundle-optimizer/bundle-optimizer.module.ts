import { Module } from "@nestjs/common";
import { AddressesModule } from "../addresses/addresses.module";
import { AvailabilityModule } from "../availability/availability.module";
import { PricingModule } from "../pricing/pricing.module";
import { LenderReliabilityService } from "./lender-reliability.service";
import { BeamSearchService } from "./beam-search.service";
import { BundleExplanationService } from "./bundle-explanation.service";
import { BundleOptimizerController } from "./bundle-optimizer.controller";
import { BundleOptimizerService } from "./bundle-optimizer.service";
import { BundleScoringService } from "./bundle-scoring.service";
import { CandidateFilterService } from "./candidate-filter.service";
import { MetricNormalizationService } from "./metric-normalization.service";
import { ParetoFilterService } from "./pareto-filter.service";
import { PreferenceMappingService } from "./preference-mapping.service";

@Module({
  imports: [AvailabilityModule, PricingModule, AddressesModule],
  controllers: [BundleOptimizerController],
  providers: [
    BundleOptimizerService,
    CandidateFilterService,
    MetricNormalizationService,
    BundleScoringService,
    BeamSearchService,
    ParetoFilterService,
    BundleExplanationService,
    PreferenceMappingService,
    LenderReliabilityService,
  ],
  exports: [BundleOptimizerService],
})
export class BundleOptimizerModule {}
