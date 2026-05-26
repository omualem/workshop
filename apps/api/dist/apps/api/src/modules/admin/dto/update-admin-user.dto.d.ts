declare class AdminUpdateLenderProfileDto {
    displayName?: string;
    bio?: string;
    averageRating?: number;
    completedTransactionsCount?: number;
    reliabilityScoreCached?: number;
    cancellationRate?: number;
    lateReturnRate?: number;
    complaintRate?: number;
    responseTimeScore?: number;
    verificationLevel?: "BASIC" | "VERIFIED" | "TRUSTED";
}
declare class AdminUpdateRenterProfileDto {
    defaultAddressText?: string;
    verificationStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
    preferences?: Record<string, unknown>;
}
export declare class UpdateAdminUserDto {
    fullName?: string;
    email?: string;
    phone?: string;
    role?: "GUEST" | "RENTER" | "LENDER" | "ADMIN";
    status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DELETED";
    lenderProfile?: AdminUpdateLenderProfileDto;
    renterProfile?: AdminUpdateRenterProfileDto;
}
export {};
