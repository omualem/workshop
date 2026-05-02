import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ListingAttributeValueInputDto {
  @IsString()
  @MinLength(1)
  attributeKey!: string;

  attributeValue!: unknown;
}

export class ListingAvailabilityBlockInputDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsIn(["AVAILABLE", "BLOCKED", "BOOKED", "MAINTENANCE"])
  status?: "AVAILABLE" | "BLOCKED" | "BOOKED" | "MAINTENANCE";

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateListingDto {
  @IsString()
  categoryId!: string;

  @IsString()
  cityId!: string;

  @IsString()
  streetId!: string;

  @IsInt()
  @Min(1)
  addressNumber!: number;

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

  @IsOptional()
  @IsString()
  suitableFor?: string;

  @IsOptional()
  @IsString()
  mainUses?: string;

  @IsIn(["NEW", "LIKE_NEW", "GOOD", "FAIR", "HEAVY_USE"])
  condition!: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE";

  @IsNumber()
  @IsPositive()
  basePriceDaily!: number;

  @IsNumber()
  @Min(0)
  depositAmount!: number;

  @IsOptional()
  @IsNumber()
  pickupLat?: number;

  @IsOptional()
  @IsNumber()
  pickupLng?: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  pickupAddressText?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  pickupInstructions?: string;

  @IsBoolean()
  deliverySupported!: boolean;

  @IsOptional()
  includedItems?: string[];

  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @IsOptional()
  @IsString()
  returnTerms?: string;

  @IsOptional()
  @IsBoolean()
  requiresOperator?: boolean;

  @IsOptional()
  @IsBoolean()
  setupRequired?: boolean;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingAttributeValueInputDto)
  attributeValues?: ListingAttributeValueInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingAvailabilityBlockInputDto)
  availabilityBlocks?: ListingAvailabilityBlockInputDto[];
}
