import { IsArray, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsString()
  bookingId!: string;

  @IsOptional()
  @IsString()
  listingId?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  text!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
