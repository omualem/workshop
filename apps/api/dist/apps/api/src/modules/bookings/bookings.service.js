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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
const audit_service_1 = require("../audit/audit.service");
const availability_service_1 = require("../availability/availability.service");
const pricing_service_1 = require("../pricing/pricing.service");
let BookingsService = class BookingsService {
    prisma;
    availabilityService;
    pricingService;
    auditService;
    constructor(prisma, availabilityService, pricingService, auditService) {
        this.prisma = prisma;
        this.availabilityService = availabilityService;
        this.pricingService = pricingService;
        this.auditService = auditService;
    }
    async create(renterId, dto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        const listings = await this.prisma.listing.findMany({
            where: {
                id: { in: dto.items.map((item) => item.listingId) },
            },
            include: {
                pricingRules: true,
            },
        });
        if (listings.length !== dto.items.length) {
            throw new common_1.NotFoundException("One or more listings were not found");
        }
        for (const item of dto.items) {
            const listing = listings.find((entry) => entry.id === item.listingId);
            const available = await this.availabilityService.isListingAvailable(item.listingId, item.quantity, startDate, endDate, listing.inventoryCount);
            if (!available) {
                throw new common_1.ForbiddenException(`Listing ${item.listingId} is not available`);
            }
        }
        const pricedItems = dto.items.map((item) => {
            const listing = listings.find((entry) => entry.id === item.listingId);
            const price = this.pricingService.computeListingPrice(listing, startDate, endDate, item.quantity);
            return {
                listing,
                item,
                price,
            };
        });
        const computedTotalPrice = pricedItems.reduce((sum, entry) => sum + entry.price.total, 0);
        const computedTotalDeposit = pricedItems.reduce((sum, entry) => sum + (0, prisma_utils_1.decimalToNumber)(entry.listing.depositAmount) * entry.item.quantity, 0);
        const booking = await this.prisma.$transaction(async (tx) => {
            for (const entry of pricedItems) {
                const [bookedItems, blockedItems] = await Promise.all([
                    tx.bookingItem.findMany({
                        where: {
                            listingId: entry.listing.id,
                            booking: {
                                status: {
                                    in: ["PENDING", "APPROVED", "CONFIRMED", "IN_PROGRESS"],
                                },
                                startDate: { lt: endDate },
                                endDate: { gt: startDate },
                            },
                        },
                        select: { quantity: true },
                    }),
                    tx.listingAvailabilityBlock.findMany({
                        where: {
                            listingId: entry.listing.id,
                            startDate: { lt: endDate },
                            endDate: { gt: startDate },
                            status: {
                                in: ["BLOCKED", "BOOKED", "MAINTENANCE"],
                            },
                        },
                        select: { quantity: true },
                    }),
                ]);
                const bookedQuantity = bookedItems.reduce((sum, item) => sum + item.quantity, 0);
                const blockedQuantity = blockedItems.reduce((sum, item) => sum + item.quantity, 0);
                if (bookedQuantity + blockedQuantity + entry.item.quantity > entry.listing.inventoryCount) {
                    throw new common_1.ForbiddenException(`Listing ${entry.listing.id} became unavailable`);
                }
            }
            const created = await tx.booking.create({
                data: {
                    renterId,
                    startDate,
                    endDate,
                    totalPrice: computedTotalPrice,
                    totalDeposit: dto.totalDeposit ?? computedTotalDeposit,
                    logisticsScoreSnapshot: 0,
                    reliabilityScoreSnapshot: 0,
                    items: {
                        create: pricedItems.map((entry) => ({
                            listingId: entry.listing.id,
                            lenderId: entry.listing.lenderId,
                            quantity: entry.item.quantity,
                            itemPrice: entry.price.total,
                            depositAmount: (0, prisma_utils_1.decimalToNumber)(entry.listing.depositAmount) * entry.item.quantity,
                            pickupMethod: entry.item.pickupMethod,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });
            return created;
        });
        await this.auditService.log({
            actorUserId: renterId,
            action: "booking.create",
            entityType: "Booking",
            entityId: booking.id,
            after: booking,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(booking);
    }
    async renterBookings(renterId) {
        const bookings = await this.prisma.booking.findMany({
            where: { renterId },
            include: {
                items: {
                    include: {
                        listing: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return bookings.map((booking) => (0, prisma_utils_1.normalizeDecimalObject)(booking));
    }
    async lenderBookings(lenderId) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                items: {
                    some: {
                        lenderId,
                    },
                },
            },
            include: {
                renter: {
                    select: { id: true, fullName: true, email: true },
                },
                items: {
                    where: { lenderId },
                    include: {
                        listing: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return bookings.map((booking) => (0, prisma_utils_1.normalizeDecimalObject)(booking));
    }
    async updateLenderBookingStatus(lenderId, bookingId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                items: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const ownsAnyItem = booking.items.some((item) => item.lenderId === lenderId);
        if (!ownsAnyItem) {
            throw new common_1.ForbiddenException("Booking does not belong to current lender");
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: dto.status,
            },
        });
        await this.auditService.log({
            actorUserId: lenderId,
            action: "booking.status.update",
            entityType: "Booking",
            entityId: bookingId,
            before: booking,
            after: updated,
        });
        return (0, prisma_utils_1.normalizeDecimalObject)(updated);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        availability_service_1.AvailabilityService,
        pricing_service_1.PricingService,
        audit_service_1.AuditService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map