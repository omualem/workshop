"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const audit_service_1 = require("../audit/audit.service");
const categories_service_1 = require("../categories/categories.service");
let AdminService = class AdminService {
    prisma;
    auditService;
    categoriesService;
    constructor(prisma, auditService, categoriesService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.categoriesService = categoriesService;
    }
    auditLogs() {
        return this.auditService.findMany();
    }
    async overview() {
        const [users, lenders, renters, listings, disputes] = await Promise.all([
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
    async createUser(dto, actorUserId) {
        if (!dto.fullName || !dto.email) {
            throw new common_1.BadRequestException("fullName and email are required");
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
                lenderProfile: dto.role === "LENDER" || dto.lenderProfile
                    ? {
                        create: {
                            displayName: dto.lenderProfile?.displayName?.trim() ||
                                dto.fullName.trim(),
                            bio: dto.lenderProfile?.bio?.trim() || undefined,
                            averageRating: dto.lenderProfile?.averageRating ?? 0,
                            completedTransactionsCount: dto.lenderProfile?.completedTransactionsCount ?? 0,
                            reliabilityScoreCached: dto.lenderProfile?.reliabilityScoreCached ?? 0,
                            cancellationRate: dto.lenderProfile?.cancellationRate ?? 0,
                            lateReturnRate: dto.lenderProfile?.lateReturnRate ?? 0,
                            complaintRate: dto.lenderProfile?.complaintRate ?? 0,
                            responseTimeScore: dto.lenderProfile?.responseTimeScore ?? 5,
                            verificationLevel: dto.lenderProfile?.verificationLevel ?? "BASIC",
                        },
                    }
                    : undefined,
                renterProfile: dto.role === "RENTER" || dto.renterProfile
                    ? {
                        create: {
                            defaultAddressText: dto.renterProfile?.defaultAddressText?.trim() || undefined,
                            verificationStatus: dto.renterProfile?.verificationStatus ?? "PENDING",
                            preferences: (dto.renterProfile?.preferences ??
                                {
                                    locale: "he",
                                    preferenceProfile: "balanced",
                                }),
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
    async updateUser(id, dto, actorUserId) {
        const existing = await this.prisma.user.findUnique({
            where: { id },
            include: {
                renterProfile: true,
                lenderProfile: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException("User not found");
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            if (dto.lenderProfile) {
                const nextDisplayName = dto.lenderProfile.displayName ??
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
                            completedTransactionsCount: dto.lenderProfile.completedTransactionsCount,
                            reliabilityScoreCached: dto.lenderProfile.reliabilityScoreCached,
                            cancellationRate: dto.lenderProfile.cancellationRate,
                            lateReturnRate: dto.lenderProfile.lateReturnRate,
                            complaintRate: dto.lenderProfile.complaintRate,
                            responseTimeScore: dto.lenderProfile.responseTimeScore,
                            verificationLevel: dto.lenderProfile.verificationLevel,
                        },
                    });
                }
                else {
                    await tx.lenderProfile.create({
                        data: {
                            userId: id,
                            displayName: nextDisplayName,
                            bio: dto.lenderProfile.bio,
                            averageRating: dto.lenderProfile.averageRating ?? 0,
                            completedTransactionsCount: dto.lenderProfile.completedTransactionsCount ?? 0,
                            reliabilityScoreCached: dto.lenderProfile.reliabilityScoreCached ?? 0,
                            cancellationRate: dto.lenderProfile.cancellationRate ?? 0,
                            lateReturnRate: dto.lenderProfile.lateReturnRate ?? 0,
                            complaintRate: dto.lenderProfile.complaintRate ?? 0,
                            responseTimeScore: dto.lenderProfile.responseTimeScore ?? 5,
                            verificationLevel: dto.lenderProfile.verificationLevel ?? "BASIC",
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
                            preferences: dto.renterProfile.preferences,
                        },
                    });
                }
                else {
                    await tx.renterProfile.create({
                        data: {
                            userId: id,
                            defaultAddressText: dto.renterProfile.defaultAddressText,
                            verificationStatus: dto.renterProfile.verificationStatus ?? "PENDING",
                            preferences: (dto.renterProfile.preferences ??
                                {
                                    locale: "he",
                                    preferenceProfile: "balanced",
                                }),
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
    async deleteUser(id, actorUserId) {
        const existing = await this.prisma.user.findUnique({
            where: { id },
            include: {
                renterProfile: true,
                lenderProfile: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException("User not found");
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
    adminCreateCategory(dto, actorUserId) {
        return this.categoriesService.create(dto, actorUserId);
    }
    adminUpdateCategory(id, dto, actorUserId) {
        return this.categoriesService.update(id, dto, actorUserId);
    }
    adminDeleteCategory(id, actorUserId) {
        return this.categoriesService.remove(id, actorUserId);
    }
    toAdminUser(user) {
        const profileType = user.lenderProfile && user.renterProfile
            ? "BOTH"
            : user.lenderProfile
                ? "LENDER"
                : user.renterProfile
                    ? "RENTER"
                    : "NONE";
        return (0, prisma_utils_1.normalizeDecimalObject)({
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        categories_service_1.CategoriesService])
], AdminService);
//# sourceMappingURL=admin.service.js.map