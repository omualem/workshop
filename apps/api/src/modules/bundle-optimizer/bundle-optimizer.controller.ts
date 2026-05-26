import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../../shared/decorators/public.decorator";
import { ZodValidationPipe } from "../../shared/pipes/zod-validation.pipe";
import { BundleOptimizerService } from "./bundle-optimizer.service";
import {
  optimizerRequestBodySchema,
  type OptimizerRequestBody,
} from "./bundle-optimizer.types";

@Controller("bundle-optimizer")
export class BundleOptimizerController {
  constructor(private readonly optimizer: BundleOptimizerService) {}

  /**
   * POST /bundle-optimizer/search
   *
   * Accepts only user-facing inputs (slots, dates, location, budget, profile
   * + sliders). Algorithm-tuning parameters are populated server-side inside
   * BundleOptimizerService.optimize so the client cannot influence them.
   */
  @Public()
  @Post("search")
  search(
    @Body(new ZodValidationPipe(optimizerRequestBodySchema))
    body: OptimizerRequestBody,
  ) {
    return this.optimizer.optimize(body);
  }
}
