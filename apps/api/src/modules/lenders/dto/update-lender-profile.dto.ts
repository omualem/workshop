import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateLenderProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
