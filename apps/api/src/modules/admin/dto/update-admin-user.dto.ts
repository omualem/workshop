import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class AdminUpdateLenderProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  averageRating?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  completedTransactionsCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  reliabilityScoreCached?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  cancellationRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  lateReturnRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  complaintRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  responseTimeScore?: number;

  @IsOptional()
  @IsEnum(["BASIC", "VERIFIED", "TRUSTED"])
  verificationLevel?: "BASIC" | "VERIFIED" | "TRUSTED";
}

class AdminUpdateRenterProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  defaultAddressText?: string;

  @IsOptional()
  @IsEnum(["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"])
  verificationStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

  @IsOptional()
  @IsObject()
  preferences?: Record<string, unknown>;
}

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsEnum(["GUEST", "RENTER", "LENDER", "ADMIN"])
  role?: "GUEST" | "RENTER" | "LENDER" | "ADMIN";

  @IsOptional()
  @IsEnum(["ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "DELETED"])
  status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DELETED";

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminUpdateLenderProfileDto)
  lenderProfile?: AdminUpdateLenderProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminUpdateRenterProfileDto)
  renterProfile?: AdminUpdateRenterProfileDto;
}
