import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  findAll() {
    return this.prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ parentId: "asc" }, { nameHe: "asc" }],
      include: {
        children: true,
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
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

  async create(dto: CreateCategoryDto, actorUserId?: string) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException("Category slug already exists");
    }

    const category = await this.prisma.category.create({
      data: {
        parentId: dto.parentId,
        slug: dto.slug,
        nameHe: dto.nameHe,
        nameEn: dto.nameEn,
        attributesSchema: dto.attributesSchema as Prisma.InputJsonValue | undefined,
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

  async update(id: string, dto: UpdateCategoryDto, actorUserId?: string) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Category not found");
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const duplicate = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });

      if (duplicate) {
        throw new ConflictException("Category slug already exists");
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        parentId: dto.parentId,
        slug: dto.slug,
        nameHe: dto.nameHe,
        nameEn: dto.nameEn,
        attributesSchema: dto.attributesSchema as Prisma.InputJsonValue | undefined,
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
}
