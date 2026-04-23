import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
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
        renterProfile:
          dto.role === "RENTER"
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
        lenderProfile:
          dto.role === "LENDER"
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValid = await argon2.verify(user.passwordHash, dto.password);

    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.createSession(user.id, user.email, user.role, user.fullName);
  }

  async refresh(refreshToken: string) {
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

      return this.createSession(
        session.user.id,
        session.user.email,
        session.user.role,
        session.user.fullName,
      );
    }

    throw new UnauthorizedException("Refresh token invalid");
  }

  async logout(refreshToken?: string) {
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

  private async createSession(userId: string, email: string, role: string, fullName: string) {
    const payload = { sub: userId, email, role, fullName };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get<string>("JWT_ACCESS_TTL", "15m") as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_TTL", "7d") as any,
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
}
