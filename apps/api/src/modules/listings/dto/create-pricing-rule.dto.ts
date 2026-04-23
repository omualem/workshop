import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class CreatePricingRuleDto {
  @IsIn([
    "DURATION_DISCOUNT",
    "FIXED_OVERRIDE",
    "WEEKEND_ADJUSTMENT",
    "SEASONAL_ADJUSTMENT",
  ])
  ruleType!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  minDays?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxDays?: number;

  @IsOptional()
  @IsNumber()
  percentDiscount?: number;

  @IsOptional()
  @IsNumber()
  fixedOverride?: number;

  @IsOptional()
  @IsNumber()
  weekendAdjustment?: number;

  @IsOptional()
  @IsNumber()
  seasonalAdjustment?: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
