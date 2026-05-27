import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { UpdateLenderProfileDto } from "./dto/update-lender-profile.dto";
export declare class LendersService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    me(userId: string): Promise<{
        user: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            status: import(".prisma/client").$Enums.UserStatus;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
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
        userId: string;
    }>;
    update(userId: string, dto: UpdateLenderProfileDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
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
        userId: string;
    }>;
}
