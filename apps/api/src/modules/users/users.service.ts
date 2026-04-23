import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { normalizeDecimalObject } from "../../shared/utils/prisma.utils";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        renterProfile: true,
        lenderProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return normalizeDecimalObject(user);
  }
}
