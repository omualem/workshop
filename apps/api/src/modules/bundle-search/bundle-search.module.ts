import { Module } from "@nestjs/common";
import { AvailabilityModule } from "../availability/availability.module";
import { PricingModule } from "../pricing/pricing.module";
import { BundleExplanationService } from "./bundle-explanation.service";
import { BundleGenerationService } from "./bundle-generation.service";
import { BundleScoringService } from "./bundle-scoring.service";
import { BundleSearchController } from "./bundle-search.controller";
import { BundleSearchService } from "./bundle-search.service";
import { LenderReliabilityService } from "./lender-reliability.service";
import { RankingConfigService } from "./ranking-config.service";

@Module({
  imports: [AvailabilityModule, PricingModule],
  controllers: [BundleSearchController],
  providers: [
    BundleSearchService,
    RankingConfigService,
    LenderReliabilityService,
    BundleGenerationService,
    BundleScoringService,
    BundleExplanationService,
  ],
  exports: [BundleSearchService, RankingConfigService],
})
export class BundleSearchModule {}
