import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
export declare class CategoriesService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    findAll(): Prisma.PrismaPromise<({
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameHe: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        parentId: string | null;
        slug: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    })[]>;
    findOne(id: string): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameHe: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        parentId: string | null;
        slug: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    findAllAdmin(includeArchived?: boolean): Prisma.PrismaPromise<({
        _count: {
            listings: number;
        };
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameHe: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        parentId: string | null;
        slug: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    })[]>;
    create(dto: CreateCategoryDto, actorUserId?: string): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameHe: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        parentId: string | null;
        slug: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    update(id: string, dto: UpdateCategoryDto, actorUserId?: string): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameHe: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        parentId: string | null;
        slug: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    remove(id: string, actorUserId?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
    }>;
}
