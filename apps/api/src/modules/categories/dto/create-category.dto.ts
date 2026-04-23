import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  slug!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nameHe!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nameEn!: string;

  @IsOptional()
  attributesSchema?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(["ACTIVE", "ARCHIVED"])
  status?: "ACTIVE" | "ARCHIVED";
}
