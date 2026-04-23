"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const audit_service_1 = require("../audit/audit.service");
let ReviewsService = class ReviewsService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async create(reviewerId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: {
                items: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        if (booking.renterId !== reviewerId) {
            throw new common_1.ForbiddenException("Only the renter can review this booking");
        }
        const revieweeUserId = booking.items[0]?.lenderId;
        if (!revieweeUserId) {
            throw new common_1.NotFoundException("Booking has no lender");
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
    async lenderReviews(lenderId) {
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
        return reviews.map((review) => (0, prisma_utils_1.normalizeDecimalObject)(review));
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map