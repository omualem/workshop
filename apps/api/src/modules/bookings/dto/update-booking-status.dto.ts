import { IsIn } from "class-validator";

export class UpdateBookingStatusDto {
  @IsIn([
    "PENDING",
    "APPROVED",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "REJECTED",
    "DISPUTED",
  ])
  status!: string;
}
