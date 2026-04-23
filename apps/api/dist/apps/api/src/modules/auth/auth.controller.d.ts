import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, response: Response): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto, response: Response): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(dto: RefreshDto, response: Response): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(dto: RefreshDto, response: Response): Promise<{
        success: boolean;
    }>;
    private attachCookies;
}
