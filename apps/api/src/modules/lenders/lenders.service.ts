import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { normalizeDecimalObject } from "../../shared/utils/prisma.utils";
import { AuditService } from "../audit/audit.service";
import { UpdateLenderProfileDto } from "./dto/update-lender-profile.dto";

@Injectable()
export class LendersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async me(userId: string) {
    const lender = await this.prisma.lenderProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
      },
    });

    if (!lender) {
      throw new NotFoundException("Lender profile not found");
    }

    return normalizeDecimalObject(lender);
  }

  async update(userId: string, dto: UpdateLenderProfileDto) {
    const existing = await this.prisma.lenderProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException("Lender profile not found");
    }

    const updated = await this.prisma.lenderProfile.update({
      where: { userId },
      data: dto,
    });

    await this.auditService.log({
      actorUserId: userId,
      action: "lender-profile.update",
      entityType: "LenderProfile",
      entityId: userId,
      before: existing,
      after: updated,
    });

    return normalizeDecimalObject(updated);
  }
}
