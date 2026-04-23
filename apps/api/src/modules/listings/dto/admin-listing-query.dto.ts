import { IsOptional, IsString } from "class-validator";

export class AdminListingQueryDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  lenderId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
