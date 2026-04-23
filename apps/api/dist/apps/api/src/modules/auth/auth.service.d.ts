import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly auditService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, auditService: AuditService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken?: string): Promise<{
        success: boolean;
    }>;
    private createSession;
}
