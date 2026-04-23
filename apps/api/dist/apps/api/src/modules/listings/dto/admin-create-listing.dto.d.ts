import { CreateListingDto } from "./create-listing.dto";
export declare class AdminCreateListingDto extends CreateListingDto {
    lenderId: string;
    status?: "DRAFT" | "PENDING_REVIEW" | "ACTIVE" | "BLOCKED" | "ARCHIVED";
}
