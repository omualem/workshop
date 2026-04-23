import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { BundleSearchService } from "../bundle-search/bundle-search.service";
import { RankingConfigService } from "../bundle-search/ranking-config.service";
import { UpdateRankingConfigDto } from "./dto/update-ranking-config.dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly bundleSearchService: BundleSearchService,
    private readonly rankingConfigService: RankingConfigService,
  ) {}

  bundleSearchDebug(id: string) {
    return this.bundleSearchService.debugSearch(id);
  }

  async updateRankingConfig(actorUserId: string, dto: UpdateRankingConfigDto) {
    const config = await this.rankingConfigService.updatePreset(
      dto.presetKey,
      dto.displayNameHe,
      dto.weights,
      actorUserId,
    );

    await this.auditService.log({
      actorUserId,
      action: "ranking-config.update",
      entityType: "RankingConfig",
      entityId: config.id,
      after: config,
    });

    return config;
  }

  auditLogs() {
    return this.auditService.findMany();
  }

  async overview() {
    const [users, lenders, renters, listings, bundleSearches, disputes] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: "LENDER" } }),
      this.prisma.user.count({ where: { role: "RENTER" } }),
      this.prisma.listing.count(),
      this.prisma.bundleSearchRequest.count(),
      this.prisma.dispute.count(),
    ]);

    return {
      users,
      lenders,
      renters,
      listings,
      bundleSearches,
      disputes,
    };
  }

  async catalogOptions() {
    const [categories, lenders] = await Promise.all([
      this.prisma.category.findMany({
        orderBy: { nameHe: "asc" },
        select: {
          id: true,
          slug: true,
          nameHe: true,
          parentId: true,
          status: true,
        },
      }),
      this.prisma.lenderProfile.findMany({
        orderBy: { displayName: "asc" },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return { categories, lenders };
  }
}
