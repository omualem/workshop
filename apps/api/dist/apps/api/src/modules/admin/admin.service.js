"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const bundle_search_service_1 = require("../bundle-search/bundle-search.service");
const ranking_config_service_1 = require("../bundle-search/ranking-config.service");
let AdminService = class AdminService {
    prisma;
    auditService;
    bundleSearchService;
    rankingConfigService;
    constructor(prisma, auditService, bundleSearchService, rankingConfigService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.bundleSearchService = bundleSearchService;
        this.rankingConfigService = rankingConfigService;
    }
    bundleSearchDebug(id) {
        return this.bundleSearchService.debugSearch(id);
    }
    async updateRankingConfig(actorUserId, dto) {
        const config = await this.rankingConfigService.updatePreset(dto.presetKey, dto.displayNameHe, dto.weights, actorUserId);
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        bundle_search_service_1.BundleSearchService,
        ranking_config_service_1.RankingConfigService])
], AdminService);
//# sourceMappingURL=admin.service.js.map