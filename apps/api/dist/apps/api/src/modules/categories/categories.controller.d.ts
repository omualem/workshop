import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        children: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findAllAdmin(): import(".prisma/client").Prisma.PrismaPromise<({
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    create(dto: CreateCategoryDto, user: {
        sub: string;
    }): Promise<{
        parent: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, dto: UpdateCategoryDto, user: {
        sub: string;
    }): Promise<{
        parent: {
            status: import(".prisma/client").$Enums.CategoryStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
