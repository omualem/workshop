import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { Public } from "../../shared/decorators/public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(dto);
    this.attachCookies(response, result.accessToken, result.refreshToken);
    return result;
  }

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(dto);
    this.attachCookies(response, result.accessToken, result.refreshToken);
    return result;
  }

  @Public()
  @Post("refresh")
  async refresh(@Body() dto: RefreshDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.refresh(dto.refreshToken ?? response.req.cookies?.refreshToken);
    this.attachCookies(response, result.accessToken, result.refreshToken);
    return result;
  }

  @Post("logout")
  async logout(@Body() dto: RefreshDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.logout(dto.refreshToken ?? response.req.cookies?.refreshToken);
    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");
    return result;
  }

  private attachCookies(response: Response, accessToken: string, refreshToken: string) {
    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
  }
}
