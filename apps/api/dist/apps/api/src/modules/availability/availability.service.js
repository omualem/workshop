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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AvailabilityService = class AvailabilityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBookedQuantity(listingId, startDate, endDate) {
        const bookingItems = await this.prisma.bookingItem.findMany({
            where: {
                listingId,
                booking: {
                    status: {
                        in: ["PENDING", "APPROVED", "CONFIRMED", "IN_PROGRESS"],
                    },
                    startDate: { lt: endDate },
                    endDate: { gt: startDate },
                },
            },
            select: {
                quantity: true,
            },
        });
        return bookingItems.reduce((sum, item) => sum + item.quantity, 0);
    }
    async getBlockedQuantity(listingId, startDate, endDate) {
        const blocks = await this.prisma.listingAvailabilityBlock.findMany({
            where: {
                listingId,
                startDate: { lt: endDate },
                endDate: { gt: startDate },
                status: {
                    in: ["BLOCKED", "BOOKED", "MAINTENANCE"],
                },
            },
            select: {
                quantity: true,
            },
        });
        return blocks.reduce((sum, block) => sum + block.quantity, 0);
    }
    async isListingAvailable(listingId, quantity, startDate, endDate, inventoryCount) {
        const listing = inventoryCount !== undefined
            ? { inventoryCount }
            : await this.prisma.listing.findUnique({
                where: { id: listingId },
                select: { inventoryCount: true },
            });
        if (!listing) {
            return false;
        }
        const [bookedQuantity, blockedQuantity] = await Promise.all([
            this.getBookedQuantity(listingId, startDate, endDate),
            this.getBlockedQuantity(listingId, startDate, endDate),
        ]);
        return bookedQuantity + blockedQuantity + quantity <= listing.inventoryCount;
    }
    async availabilityFragilityScore(listingId, startDate, endDate) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            select: { inventoryCount: true },
        });
        if (!listing) {
            return 0;
        }
        const [bookedQuantity, blockedQuantity] = await Promise.all([
            this.getBookedQuantity(listingId, startDate, endDate),
            this.getBlockedQuantity(listingId, startDate, endDate),
        ]);
        const remaining = Math.max(0, listing.inventoryCount - bookedQuantity - blockedQuantity);
        return Math.max(0, Math.min(10, (remaining / Math.max(1, listing.inventoryCount)) * 10));
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map