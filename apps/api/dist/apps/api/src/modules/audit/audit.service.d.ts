import { PrismaService } from "../../prisma/prisma.service";
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(input: {
        actorUserId?: string | null;
        action: string;
        entityType: string;
        entityId: string;
        before?: unknown;
        after?: unknown;
        metadata?: unknown;
    }): Promise<{
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        action: string;
        entityType: string;
        entityId: string;
        before: import("@prisma/client/runtime/library").JsonValue | null;
        after: import("@prisma/client/runtime/library").JsonValue | null;
        actorUserId: string | null;
    }>;
    findMany(): import(".prisma/client").Prisma.PrismaPromise<({
        actor: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            fullName: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        action: string;
        entityType: string;
        entityId: string;
        before: import("@prisma/client/runtime/library").JsonValue | null;
        after: import("@prisma/client/runtime/library").JsonValue | null;
        actorUserId: string | null;
    })[]>;
}
