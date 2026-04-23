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
exports.LendersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const audit_service_1 = require("../audit/audit.service");
let LendersService = class LendersService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async me(userId) {
        const lender = await this.prisma.lenderProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        status: true,
                    },
                },
            },
        });
        if (!lender) {
            throw new common_1.NotFoundException("Lender profile not found");
        }
        return (0, prisma_utils_1.normalizeDecimalObject)(lender);
    }
    async update(userId, dto) {
        const existing = await this.prisma.lenderProfile.findUnique({
            where: { userId },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Lender profile not found");
        }
        const updated = await this.prisma.lenderProfile.update({
            where: { userId },
            data: dto,
        });
        await this.auditService.log({
            actorUserId: userId,
            action: "lender-profile.update",
            entityType: "LenderProfile",
            entityId: userId,
            before: existing,
            after: updated,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(updated);
    }
};
exports.LendersService = LendersService;
exports.LendersService = LendersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], LendersService);
//# sourceMappingURL=lenders.service.js.map