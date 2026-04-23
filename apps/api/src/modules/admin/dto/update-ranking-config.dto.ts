import { IsNumber, IsObject, IsString, MaxLength, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class WeightDto {
  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  reliability!: number;

  @IsNumber()
  @Min(0)
  logistics!: number;

  @IsNumber()
  @Min(0)
  availability!: number;

  @IsNumber()
  @Min(0)
  quality!: number;
}

export class UpdateRankingConfigDto {
  @IsString()
  @MaxLength(64)
  presetKey!: string;

  @IsString()
  @MaxLength(120)
  displayNameHe!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => WeightDto)
  weights!: WeightDto;
}
