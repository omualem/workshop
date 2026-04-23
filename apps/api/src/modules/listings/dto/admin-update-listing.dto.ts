import { PartialType } from "@nestjs/mapped-types";
import { AdminCreateListingDto } from "./admin-create-listing.dto";

export class AdminUpdateListingDto extends PartialType(AdminCreateListingDto) {}
