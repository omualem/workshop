import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: {
    actorUserId?: string | null;
    action: string;
    entityType: string;
    entityId: string;
    before?: unknown;
    after?: unknown;
    metadata?: unknown;
  }) {
    return this.prisma.auditLog.create({
      data: {
        actorUserId: input.actorUserId ?? undefined,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        before: input.before as any,
        after: input.after as any,
        metadata: input.metadata as any,
      },
    });
  }

  findMany() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        actor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}
