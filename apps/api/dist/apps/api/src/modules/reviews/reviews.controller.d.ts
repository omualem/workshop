import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewsService } from "./reviews.service";
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(user: {
        sub: string;
    }, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        bookingId: string;
        listingId: string | null;
        reviewerId: string;
        revieweeUserId: string;
        rating: number;
        text: string;
        tags: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    lenderReviews(id: string): Promise<({
        listing: {
            titleHe: string;
        } | null;
        reviewer: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        bookingId: string;
        listingId: string | null;
        reviewerId: string;
        revieweeUserId: string;
        rating: number;
        text: string;
        tags: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
}
