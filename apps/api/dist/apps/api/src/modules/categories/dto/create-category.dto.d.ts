export declare class CreateCategoryDto {
    parentId?: string;
    slug: string;
    nameHe: string;
    nameEn: string;
    attributesSchema?: Record<string, unknown>;
    status?: "ACTIVE" | "ARCHIVED";
}
