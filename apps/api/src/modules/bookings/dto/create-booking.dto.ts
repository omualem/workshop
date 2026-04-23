import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class BookingItemInputDto {
  @IsString()
  listingId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsIn(["PICKUP", "DELIVERY", "HYBRID"])
  pickupMethod!: "PICKUP" | "DELIVERY" | "HYBRID";
}

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  bundleCandidateId?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsNumber()
  totalPrice!: number;

  @IsOptional()
  @IsNumber()
  totalDeposit?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingItemInputDto)
  items!: BookingItemInputDto[];
}
