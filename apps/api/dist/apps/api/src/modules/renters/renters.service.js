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
exports.RentersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_utils_1 = require("../../shared/utils/prisma.utils");
let RentersService = class RentersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async me(userId) {
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
            throw new common_1.NotFoundException("Renter profile not found");
        }
        return (0, prisma_utils_1.normalizeDecimalObject)(renter);
    }
    savedSearches(userId) {
        return this.prisma.savedSearch.findMany({
            where: { renterId: userId },
            orderBy: { createdAt: "desc" },
        });
    }
    favorites(userId) {
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
};
exports.RentersService = RentersService;
exports.RentersService = RentersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RentersService);
//# sourceMappingURL=renters.service.js.map