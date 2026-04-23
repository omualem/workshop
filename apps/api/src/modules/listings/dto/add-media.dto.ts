import { IsInt, IsString, MaxLength, Min } from "class-validator";

export class AddMediaDto {
  @IsString()
  url!: string;

  @IsInt()
  @Min(0)
  sortOrder!: number;

  @IsString()
  @MaxLength(160)
  altText!: string;
}
