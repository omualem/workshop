import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateListingDto {
  @IsString()
  categoryId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  titleHe!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  titleEn!: string;

  @IsString()
  @MinLength(10)
  descriptionHe!: string;

  @IsString()
  @MinLength(10)
  descriptionEn!: string;

  @IsIn(["NEW", "LIKE_NEW", "GOOD", "FAIR", "HEAVY_USE"])
  condition!: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE";

  @IsNumber()
  @IsPositive()
  basePriceDaily!: number;

  @IsNumber()
  @Min(0)
  depositAmount!: number;

  @IsNumber()
  pickupLat!: number;

  @IsNumber()
  pickupLng!: number;

  @IsString()
  @MinLength(4)
  pickupAddressText!: string;

  @IsBoolean()
  deliverySupported!: boolean;

  @IsInt()
  @Min(1)
  inventoryCount!: number;

  @IsInt()
  @Min(1)
  minRentalDays!: number;

  @IsInt()
  @Min(1)
  maxRentalDays!: number;

  @IsOptional()
  attributeValues?: Array<{
    attributeKey: string;
    attributeValue: unknown;
  }>;
}
