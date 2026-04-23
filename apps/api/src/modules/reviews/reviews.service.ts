import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { normalizeDecimalObject } from "../../shared/utils/prisma.utils";
import { AuditService } from "../audit/audit.service";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        items: true,
      },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.renterId !== reviewerId) {
      throw new ForbiddenException("Only the renter can review this booking");
    }

    const revieweeUserId = booking.items[0]?.lenderId;

    if (!revieweeUserId) {
      throw new NotFoundException("Booking has no lender");
    }

    const review = await this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        reviewerId,
        revieweeUserId,
        listingId: dto.listingId,
        rating: dto.rating,
        text: dto.text,
        tags: dto.tags,
      },
    });

    await this.auditService.log({
      actorUserId: reviewerId,
      action: "review.create",
      entityType: "Review",
      entityId: review.id,
      after: review,
    });

    return review;
  }

  async lenderReviews(lenderId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        revieweeUserId: lenderId,
      },
      include: {
        reviewer: {
          select: { fullName: true },
        },
        listing: {
          select: { titleHe: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews.map((review: (typeof reviews)[number]) => normalizeDecimalObject(review));
  }
}
