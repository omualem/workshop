import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { normalizeDecimalObject } from "../../shared/utils/prisma.utils";

@Injectable()
export class RentersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const renter = await this.prisma.renterProfile.findUnique({
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

    if (!renter) {
      throw new NotFoundException("Renter profile not found");
    }

    return normalizeDecimalObject(renter);
  }

  savedSearches(userId: string) {
    return this.prisma.savedSearch.findMany({
      where: { renterId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  favorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { renterId: userId },
      include: {
        listing: {
          include: {
            category: true,
            lender: true,
            media: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
