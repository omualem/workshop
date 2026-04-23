import { Injectable } from "@nestjs/common";
import { DEFAULT_RANKING_PRESETS } from "@rental/config";
import { resolvePresetWeights } from "@rental/scoring";
import type { BundleSearchInput, RankingWeights } from "@rental/types";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RankingConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveWeights(input: BundleSearchInput): Promise<RankingWeights> {
    const presetWeights = resolvePresetWeights(input.preferenceProfile, input.weights);
    const config = await this.prisma.rankingConfig.findUnique({
      where: { presetKey: input.preferenceProfile === "custom" ? "balanced" : input.preferenceProfile },
    });

    if (!config) {
      return presetWeights;
    }

    if (input.preferenceProfile === "custom" && input.weights) {
      return resolvePresetWeights("custom", input.weights);
    }

    return resolvePresetWeights("custom", config.weights as RankingWeights);
  }

  defaults() {
    return DEFAULT_RANKING_PRESETS;
  }

  async updatePreset(
    presetKey: string,
    displayNameHe: string,
    weights: RankingWeights,
    actorUserId?: string,
  ) {
    return this.prisma.rankingConfig.upsert({
      where: { presetKey },
      create: {
        presetKey,
        displayNameHe,
        weights,
        updatedByUserId: actorUserId,
      },
      update: {
        displayNameHe,
        weights,
        updatedByUserId: actorUserId,
      },
    });
  }
}
