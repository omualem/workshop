import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateReviewDto } from "./dto/create-review.dto";
export declare class ReviewsService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    create(reviewerId: string, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        listingId: string | null;
        bookingId: string;
        reviewerId: string;
        revieweeUserId: string;
        rating: number;
        text: string;
        tags: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    lenderReviews(lenderId: string): Promise<({
        listing: {
            titleHe: string;
        } | null;
        reviewer: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        listingId: string | null;
        bookingId: string;
        reviewerId: string;
        revieweeUserId: string;
        rating: number;
        text: string;
        tags: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
}
