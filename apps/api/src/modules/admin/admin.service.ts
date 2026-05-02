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
    const [users, lenders, renters, listings, bundleSearches, disputes] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.lenderProfile.count(),
        this.prisma.renterProfile.count(),
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

  async users() {
    const users = await this.prisma.user.findMany({
      orderBy: [{ role: "asc" }, { email: "asc" }],
      include: {
        renterProfile: true,
        lenderProfile: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      locale: user.locale,
      createdAt: user.createdAt,
      hasRenterProfile: Boolean(user.renterProfile),
      hasLenderProfile: Boolean(user.lenderProfile),
      lenderDisplayName: user.lenderProfile?.displayName ?? null,
    }));
  }

  async moderationQueue() {
    return this.prisma.listing.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { updatedAt: "asc" },
      include: {
        category: {
          select: { id: true, nameHe: true, slug: true },
        },
        lender: {
          select: { userId: true, displayName: true },
        },
      },
    });
  }

  async bookings() {
    return this.prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        renter: {
          select: { id: true, fullName: true, email: true },
        },
        items: {
          include: {
            listing: {
              select: { id: true, titleHe: true },
            },
            lender: {
              select: { userId: true, displayName: true },
            },
          },
        },
      },
    });
  }

  async disputes() {
    return this.prisma.dispute.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        openedBy: {
          select: { id: true, fullName: true, email: true },
        },
        assignedAdmin: {
          select: { id: true, fullName: true, email: true },
        },
        booking: {
          select: { id: true, status: true },
        },
      },
    });
  }

  async reviews() {
    return this.prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reviewer: {
          select: { id: true, fullName: true, email: true },
        },
        reviewee: {
          select: { id: true, fullName: true, email: true },
        },
        listing: {
          select: { id: true, titleHe: true },
        },
      },
    });
  }

  async rankingConfig() {
    return this.prisma.rankingConfig.findMany({
      orderBy: { presetKey: "asc" },
      include: {
        updatedBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  }
}
