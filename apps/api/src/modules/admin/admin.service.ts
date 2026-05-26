import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as argon2 from "argon2";
import { PrismaService } from "../../prisma/prisma.service";
import { normalizeDecimalObject } from "../../shared/utils/prisma.utils";
import { AuditService } from "../audit/audit.service";
import { CategoriesService } from "../categories/categories.service";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly categoriesService: CategoriesService,
  ) {}

  auditLogs() {
    return this.auditService.findMany();
  }

  async overview() {
    const [users, lenders, renters, listings, disputes] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.lenderProfile.count(),
        this.prisma.renterProfile.count(),
        this.prisma.listing.count(),
        this.prisma.dispute.count(),
      ]);

    return {
      users,
      lenders,
      renters,
      listings,
      disputes,
    };
  }

  async catalogOptions() {
    const [categories, lenders] = await Promise.all([
      this.prisma.category.findMany({
        where: { status: { not: "ARCHIVED" } },
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
        where: { user: { status: { not: "DELETED" } } },
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

  async users(includeDeleted = false) {
    const users = await this.prisma.user.findMany({
      where: includeDeleted ? undefined : { status: { not: "DELETED" } },
      orderBy: [{ role: "asc" }, { email: "asc" }],
      include: {
        renterProfile: true,
        lenderProfile: true,
      },
    });

    return users.map((user) => this.toAdminUser(user));
  }

  async createUser(dto: UpdateAdminUserDto, actorUserId?: string) {
    if (!dto.fullName || !dto.email) {
      throw new BadRequestException("fullName and email are required");
    }

    const passwordHash = await argon2.hash("demo123456");
    const created = await this.prisma.user.create({
      data: {
        fullName: dto.fullName.trim(),
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone?.trim() || "",
        passwordHash,
        role: dto.role ?? "RENTER",
        status: dto.status ?? "ACTIVE",
        lenderProfile:
          dto.role === "LENDER" || dto.lenderProfile
            ? {
                create: {
                  displayName:
                    dto.lenderProfile?.displayName?.trim() ||
                    dto.fullName.trim(),
                  bio: dto.lenderProfile?.bio?.trim() || undefined,
                  averageRating: dto.lenderProfile?.averageRating ?? 0,
                  completedTransactionsCount:
                    dto.lenderProfile?.completedTransactionsCount ?? 0,
                  reliabilityScoreCached:
                    dto.lenderProfile?.reliabilityScoreCached ?? 0,
                  cancellationRate: dto.lenderProfile?.cancellationRate ?? 0,
                  lateReturnRate: dto.lenderProfile?.lateReturnRate ?? 0,
                  complaintRate: dto.lenderProfile?.complaintRate ?? 0,
                  responseTimeScore:
                    dto.lenderProfile?.responseTimeScore ?? 5,
                  verificationLevel:
                    dto.lenderProfile?.verificationLevel ?? "BASIC",
                },
              }
            : undefined,
        renterProfile:
          dto.role === "RENTER" || dto.renterProfile
            ? {
                create: {
                  defaultAddressText:
                    dto.renterProfile?.defaultAddressText?.trim() || undefined,
                  verificationStatus:
                    dto.renterProfile?.verificationStatus ?? "PENDING",
                  preferences: (dto.renterProfile?.preferences ??
                    {
                      locale: "he",
                      preferenceProfile: "balanced",
                    }) as Prisma.InputJsonValue,
                },
              }
            : undefined,
      },
      include: {
        renterProfile: true,
        lenderProfile: true,
      },
    });

    await this.auditService.log({
      actorUserId,
      action: "admin.user.create",
      entityType: "User",
      entityId: created.id,
      after: created,
      metadata: { demoPassword: "demo123456" },
    });

    return this.toAdminUser(created);
  }

  async updateUser(id: string, dto: UpdateAdminUserDto, actorUserId?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      include: {
        renterProfile: true,
        lenderProfile: true,
      },
    });

    if (!existing) {
      throw new NotFoundException("User not found");
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.lenderProfile) {
        const nextDisplayName =
          dto.lenderProfile.displayName ??
          existing.lenderProfile?.displayName ??
          dto.fullName ??
          existing.fullName;

        if (existing.lenderProfile) {
          await tx.lenderProfile.update({
            where: { userId: id },
            data: {
              displayName: nextDisplayName,
              bio: dto.lenderProfile.bio,
              averageRating: dto.lenderProfile.averageRating,
              completedTransactionsCount:
                dto.lenderProfile.completedTransactionsCount,
              reliabilityScoreCached:
                dto.lenderProfile.reliabilityScoreCached,
              cancellationRate: dto.lenderProfile.cancellationRate,
              lateReturnRate: dto.lenderProfile.lateReturnRate,
              complaintRate: dto.lenderProfile.complaintRate,
              responseTimeScore: dto.lenderProfile.responseTimeScore,
              verificationLevel: dto.lenderProfile.verificationLevel,
            },
          });
        } else {
          await tx.lenderProfile.create({
            data: {
              userId: id,
              displayName: nextDisplayName,
              bio: dto.lenderProfile.bio,
              averageRating: dto.lenderProfile.averageRating ?? 0,
              completedTransactionsCount:
                dto.lenderProfile.completedTransactionsCount ?? 0,
              reliabilityScoreCached:
                dto.lenderProfile.reliabilityScoreCached ?? 0,
              cancellationRate: dto.lenderProfile.cancellationRate ?? 0,
              lateReturnRate: dto.lenderProfile.lateReturnRate ?? 0,
              complaintRate: dto.lenderProfile.complaintRate ?? 0,
              responseTimeScore: dto.lenderProfile.responseTimeScore ?? 5,
              verificationLevel:
                dto.lenderProfile.verificationLevel ?? "BASIC",
            },
          });
        }
      }

      if (dto.renterProfile) {
        if (existing.renterProfile) {
          await tx.renterProfile.update({
            where: { userId: id },
            data: {
              defaultAddressText: dto.renterProfile.defaultAddressText,
              verificationStatus: dto.renterProfile.verificationStatus,
              preferences: dto.renterProfile.preferences as
                | Prisma.InputJsonValue
                | undefined,
            },
          });
        } else {
          await tx.renterProfile.create({
            data: {
              userId: id,
              defaultAddressText: dto.renterProfile.defaultAddressText,
              verificationStatus:
                dto.renterProfile.verificationStatus ?? "PENDING",
              preferences: (dto.renterProfile.preferences ??
                {
                  locale: "he",
                  preferenceProfile: "balanced",
                }) as Prisma.InputJsonValue,
            },
          });
        }
      }

      await tx.user.update({
        where: { id },
        data: {
          fullName: dto.fullName,
          email: dto.email?.toLowerCase(),
          phone: dto.phone,
          role: dto.role,
          status: dto.status,
        },
      });

      if (dto.status && dto.status !== "ACTIVE") {
        await tx.listing.updateMany({
          where: {
            lenderId: id,
            status: { in: ["ACTIVE", "PENDING_REVIEW", "DRAFT"] },
          },
          data: { status: "BLOCKED" },
        });
      }

      return tx.user.findUniqueOrThrow({
        where: { id },
        include: {
          renterProfile: true,
          lenderProfile: true,
        },
      });
    });

    await this.auditService.log({
      actorUserId,
      action: "admin.user.update",
      entityType: "User",
      entityId: id,
      before: existing,
      after: updated,
    });

    return this.toAdminUser(updated);
  }

  async deleteUser(id: string, actorUserId?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      include: {
        renterProfile: true,
        lenderProfile: true,
      },
    });

    if (!existing) {
      throw new NotFoundException("User not found");
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.listing.updateMany({
        where: {
          lenderId: id,
          status: { in: ["ACTIVE", "PENDING_REVIEW", "DRAFT"] },
        },
        data: { status: "BLOCKED" },
      });

      return tx.user.update({
        where: { id },
        data: { status: "DELETED" },
        include: {
          renterProfile: true,
          lenderProfile: true,
        },
      });
    });

    await this.auditService.log({
      actorUserId,
      action: "admin.user.delete",
      entityType: "User",
      entityId: id,
      before: existing,
      after: updated,
    });

    return { id, status: updated.status };
  }

  async moderationQueue() {
    return this.prisma.listing.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { updatedAt: "asc" },
      select: {
        id: true,
        titleHe: true,
        status: true,
        updatedAt: true,
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

  adminCategories(includeArchived = false) {
    return this.categoriesService.findAllAdmin(includeArchived);
  }

  adminCreateCategory(dto: Parameters<CategoriesService["create"]>[0], actorUserId?: string) {
    return this.categoriesService.create(dto, actorUserId);
  }

  adminUpdateCategory(
    id: string,
    dto: Parameters<CategoriesService["update"]>[1],
    actorUserId?: string,
  ) {
    return this.categoriesService.update(id, dto, actorUserId);
  }

  adminDeleteCategory(id: string, actorUserId?: string) {
    return this.categoriesService.remove(id, actorUserId);
  }

  private toAdminUser(user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    locale: string;
    createdAt: Date;
    renterProfile: {
      defaultAddressText: string | null;
      verificationStatus: string;
      preferences: Prisma.JsonValue | null;
    } | null;
    lenderProfile: {
      displayName: string;
      bio: string | null;
      averageRating: Prisma.Decimal;
      completedTransactionsCount: number;
      reliabilityScoreCached: Prisma.Decimal;
      cancellationRate: Prisma.Decimal;
      lateReturnRate: Prisma.Decimal;
      complaintRate: Prisma.Decimal;
      responseTimeScore: Prisma.Decimal;
      verificationLevel: string;
    } | null;
  }) {
    const profileType = user.lenderProfile && user.renterProfile
      ? "BOTH"
      : user.lenderProfile
        ? "LENDER"
        : user.renterProfile
          ? "RENTER"
          : "NONE";

    return normalizeDecimalObject({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      locale: user.locale,
      createdAt: user.createdAt,
      type: profileType,
      hasRenterProfile: Boolean(user.renterProfile),
      hasLenderProfile: Boolean(user.lenderProfile),
      lenderDisplayName: user.lenderProfile?.displayName ?? null,
      renterProfile: user.renterProfile,
      lenderProfile: user.lenderProfile,
    });
  }
}
