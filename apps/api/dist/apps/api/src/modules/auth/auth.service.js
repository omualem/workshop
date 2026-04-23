"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    auditService;
    constructor(prisma, jwtService, configService, auditService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.auditService = auditService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException("Email already exists");
        }
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                email: dto.email.toLowerCase(),
                phone: dto.phone,
                passwordHash,
                role: dto.role,
                status: "ACTIVE",
                renterProfile: dto.role === "RENTER"
                    ? {
                        create: {
                            verificationStatus: "PENDING",
                            preferences: {
                                locale: "he",
                                preferenceProfile: "balanced",
                            },
                        },
                    }
                    : undefined,
                lenderProfile: dto.role === "LENDER"
                    ? {
                        create: {
                            displayName: dto.fullName,
                            verificationLevel: "BASIC",
                        },
                    }
                    : undefined,
            },
        });
        await this.auditService.log({
            actorUserId: user.id,
            action: "auth.register",
            entityType: "User",
            entityId: user.id,
            after: { email: user.email, role: user.role },
        });
        return this.createSession(user.id, user.email, user.role, user.fullName);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        return this.createSession(user.id, user.email, user.role, user.fullName);
    }
    async refresh(refreshToken) {
        const sessions = await this.prisma.refreshSession.findMany({
            where: {
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
            orderBy: { createdAt: "desc" },
            take: 30,
        });
        for (const session of sessions) {
            const matches = await argon2.verify(session.tokenHash, refreshToken);
            if (!matches) {
                continue;
            }
            await this.prisma.refreshSession.update({
                where: { id: session.id },
                data: { revokedAt: new Date() },
            });
            return this.createSession(session.user.id, session.user.email, session.user.role, session.user.fullName);
        }
        throw new common_1.UnauthorizedException("Refresh token invalid");
    }
    async logout(refreshToken) {
        if (!refreshToken) {
            return { success: true };
        }
        const sessions = await this.prisma.refreshSession.findMany({
            where: { revokedAt: null },
        });
        for (const session of sessions) {
            const matches = await argon2.verify(session.tokenHash, refreshToken);
            if (matches) {
                await this.prisma.refreshSession.update({
                    where: { id: session.id },
                    data: { revokedAt: new Date() },
                });
            }
        }
        return { success: true };
    }
    async createSession(userId, email, role, fullName) {
        const payload = { sub: userId, email, role, fullName };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow("JWT_ACCESS_SECRET"),
            expiresIn: this.configService.get("JWT_ACCESS_TTL", "15m"),
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
            expiresIn: this.configService.get("JWT_REFRESH_TTL", "7d"),
        });
        await this.prisma.refreshSession.create({
            data: {
                userId,
                tokenHash: await argon2.hash(refreshToken),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            user: { id: userId, email, role, fullName },
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map