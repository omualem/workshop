import { IsDateString, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateAvailabilityBlockDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsIn(["AVAILABLE", "BLOCKED", "BOOKED", "MAINTENANCE"])
  status!: "AVAILABLE" | "BLOCKED" | "BOOKED" | "MAINTENANCE";

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
