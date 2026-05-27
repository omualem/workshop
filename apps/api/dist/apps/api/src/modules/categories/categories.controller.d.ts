import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findAllAdmin(): import(".prisma/client").Prisma.PrismaPromise<({
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    create(dto: CreateCategoryDto, user: {
        sub: string;
    }): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, dto: UpdateCategoryDto, user: {
        sub: string;
    }): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string, user: {
        sub: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
    }>;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
