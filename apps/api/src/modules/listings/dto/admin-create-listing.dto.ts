import { IsEnum, IsOptional, IsString } from "class-validator";
import { CreateListingDto } from "./create-listing.dto";

export class AdminCreateListingDto extends CreateListingDto {
  @IsString()
  lenderId!: string;

  @IsOptional()
  @IsEnum(["DRAFT", "PENDING_REVIEW", "ACTIVE", "BLOCKED", "ARCHIVED"])
  status?: "DRAFT" | "PENDING_REVIEW" | "ACTIVE" | "BLOCKED" | "ARCHIVED";
}
