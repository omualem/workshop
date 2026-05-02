import type { BundleSearchInput, RankingWeights } from "@rental/types";
import { PrismaService } from "../../prisma/prisma.service";
export declare class RankingConfigService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveWeights(input: BundleSearchInput): Promise<RankingWeights>;
    defaults(): Record<string, {
        price: number;
        reliability: number;
        logistics: number;
        availability: number;
        quality: number;
    }>;
    updatePreset(presetKey: string, displayNameHe: string, weights: RankingWeights, actorUserId?: string): Promise<{
        id: string;
        updatedAt: Date;
        presetKey: string;
        displayNameHe: string;
        weights: import("@prisma/client/runtime/library").JsonValue;
        lowScoreThreshold: import("@prisma/client/runtime/library").Decimal;
        stdDevAlpha: import("@prisma/client/runtime/library").Decimal;
        lowScoreBeta: import("@prisma/client/runtime/library").Decimal;
        bottleneckGamma: import("@prisma/client/runtime/library").Decimal;
        updatedByUserId: string | null;
    }>;
}
