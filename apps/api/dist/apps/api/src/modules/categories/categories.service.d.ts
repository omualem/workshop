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
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        status: import(".prisma/client").$Enums.CategoryStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        nameHe: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    })[]>;
    findOne(id: string): Promise<{
        parent: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        status: import(".prisma/client").$Enums.CategoryStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        nameHe: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    findAllAdmin(): Prisma.PrismaPromise<({
        _count: {
            listings: number;
        };
        parent: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        status: import(".prisma/client").$Enums.CategoryStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        nameHe: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    })[]>;
    create(dto: CreateCategoryDto, actorUserId?: string): Promise<{
        parent: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        status: import(".prisma/client").$Enums.CategoryStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        nameHe: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    update(id: string, dto: UpdateCategoryDto, actorUserId?: string): Promise<{
        parent: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        status: import(".prisma/client").$Enums.CategoryStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        nameHe: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
}
