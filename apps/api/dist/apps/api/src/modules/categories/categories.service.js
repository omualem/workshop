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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let CategoriesService = class CategoriesService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    findAll() {
        return this.prisma.category.findMany({
            where: { status: "ACTIVE" },
            orderBy: [{ parentId: "asc" }, { nameHe: "asc" }],
            include: {
                children: true,
            },
        });
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException("Category not found");
        }
        return category;
    }
    findAllAdmin() {
        return this.prisma.category.findMany({
            orderBy: [{ parentId: "asc" }, { nameHe: "asc" }],
            include: {
                parent: true,
                children: true,
                _count: {
                    select: {
                        listings: true,
                    },
                },
            },
        });
    }
    async create(dto, actorUserId) {
        const existing = await this.prisma.category.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException("Category slug already exists");
        }
        const category = await this.prisma.category.create({
            data: {
                parentId: dto.parentId,
                slug: dto.slug,
                nameHe: dto.nameHe,
                nameEn: dto.nameEn,
                attributesSchema: dto.attributesSchema,
                status: dto.status ?? "ACTIVE",
            },
            include: {
                parent: true,
                children: true,
            },
        });
        await this.auditService.log({
            actorUserId,
            action: "category.create",
            entityType: "Category",
            entityId: category.id,
            after: category,
        });
        return category;
    }
    async update(id, dto, actorUserId) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Category not found");
        }
        if (dto.slug && dto.slug !== existing.slug) {
            const duplicate = await this.prisma.category.findUnique({
                where: { slug: dto.slug },
            });
            if (duplicate) {
                throw new common_1.ConflictException("Category slug already exists");
            }
        }
        const category = await this.prisma.category.update({
            where: { id },
            data: {
                parentId: dto.parentId,
                slug: dto.slug,
                nameHe: dto.nameHe,
                nameEn: dto.nameEn,
                attributesSchema: dto.attributesSchema,
                status: dto.status,
            },
            include: {
                parent: true,
                children: true,
            },
        });
        await this.auditService.log({
            actorUserId,
            action: "category.update",
            entityType: "Category",
            entityId: category.id,
            before: existing,
            after: category,
        });
        return category;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map