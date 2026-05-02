import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../../shared/decorators/public.decorator";
import { ZodValidationPipe } from "../../shared/pipes/zod-validation.pipe";
import { BundleOptimizerService } from "./bundle-optimizer.service";
import { optimizerRequestSchema, type OptimizerRequest } from "./bundle-optimizer.types";

@Controller("bundle-optimizer")
export class BundleOptimizerController {
  constructor(private readonly optimizer: BundleOptimizerService) {}

  /**
   * POST /bundle-optimizer/search
   *
   * Runs the full algorithm: hard-constraint filter → top-K pruning →
   * beam search → final objective Score(x) → Hebrew explanations.
   */
  @Public()
  @Post("search")
  search(@Body(new ZodValidationPipe(optimizerRequestSchema)) body: OptimizerRequest) {
    return this.optimizer.optimize(body);
  }
}
