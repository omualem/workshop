import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: {
        sub: string;
    }): Promise<{
        lenderProfile: {
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            isFeatured: boolean;
            pickupAreaGeo: import("@prisma/client/runtime/library").JsonValue | null;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
        } | null;
        renterProfile: {
            userId: string;
            defaultLocationLat: import("@prisma/client/runtime/library").Decimal | null;
            defaultLocationLng: import("@prisma/client/runtime/library").Decimal | null;
            defaultAddressText: string | null;
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        } | null;
    } & {
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        fullName: string;
        email: string;
        phone: string;
        passwordHash: string;
        locale: string;
    }>;
}
