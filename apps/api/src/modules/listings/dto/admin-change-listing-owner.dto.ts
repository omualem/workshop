import { IsString, MinLength } from "class-validator";

export class AdminChangeListingOwnerDto {
  @IsString()
  @MinLength(1)
  lenderId!: string;
}
