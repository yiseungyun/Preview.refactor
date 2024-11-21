import { Controller, Get, Post, Res, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { GithubProfile } from "./github/gitub-profile.decorator";
import { Profile } from "passport-github";
import { setCookieConfig } from "../config/cookie.config";
import { JwtPayload, JwtTokenPair } from "./jwt/jwt.decorator";
import { IJwtPayload, IJwtTokenPair } from "./jwt/jwt.model";

@Controller("auth")
export class AuthController {
    private static ACCESS_TOKEN = "accessToken";
    private static REFRESH_TOKEN = "refreshToken";

    constructor(private readonly authService: AuthService) {}

    @Post("github")
    @UseGuards(AuthGuard("github"))
    async githubCallback(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @GithubProfile() profile: Profile
    ) {
        const id = parseInt(profile.id);

        const result = await this.authService.getTokenByGithubId(id);

        res.cookie("accessToken", result.accessToken.token, {
            maxAge: result.accessToken.expireTime,
            ...setCookieConfig,
        });

        res.cookie("refreshToken", result.refreshToken.token, {
            maxAge: result.refreshToken.expireTime,
            ...setCookieConfig,
        });

        return {
            success: true,
        };
    }

    @Get("whoami")
    @UseGuards(AuthGuard("jwt"))
    async handleWhoami(@Req() req: Request, @JwtPayload() token: IJwtPayload) {
        return token;
    }

    @Get("refresh")
    @UseGuards(AuthGuard("jwt-refresh"))
    async handleRefresh(
        @Res({ passthrough: true }) res: Response,
        @JwtTokenPair() token: IJwtTokenPair
    ) {
        res.cookie("accessToken", token.accessToken.token, {
            maxAge: token.accessToken.expireTime,
            ...setCookieConfig,
        });

        return {
            success: true,
        };
    }
}
