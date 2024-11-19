import { Controller, Get, Res, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { JwtAuthenticationGuard } from "./jwt.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("github")
    @UseGuards(AuthGuard("github"))
    async githubAuth() {}

    /* Get Google Auth Callback */
    @Get("github/login")
    @UseGuards(AuthGuard("github"))
    async githubAuthCallback(@Req() req, @Res() res: Response) {
        try {
            const accessToken = await this.authService.githubLogin(req, res);
            return res.json({
                success: true,
                message: "login success",
                accessToken,
            });
        } catch (error) {
            return res.json({
                success: false,
                message: "login failed",
                error: error.message,
            });
        }
    }

    @Get("github/whoami")
    @UseGuards(JwtAuthenticationGuard)
    async whoami(@Req() req, @Res() res: Response) {
        return res.json({
            githubId: req.user.githubId,
            username: req.user.username,
        });
    }
}
