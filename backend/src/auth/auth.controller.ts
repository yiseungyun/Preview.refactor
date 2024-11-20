import { Controller, Get,Post, Res, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { GithubProfile } from "./decorator/gitub-profile.decorator";
import { Profile } from "passport-github";
import { Response } from "express";
import { JwtAuthenticationGuard } from "./jwt.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("github")
    @UseGuards(AuthGuard("github"))
    async githubCallback(
        @Req() req: Request,
        @GithubProfile() profile: Profile
    ) {
        const id = parseInt(profile.id);

        // const user = await this.authService.getUserByGithubId(id);
        // const jwtToken = await this.authService.createJwtToken(user);

        return {
            id,
            success: true,
            // token: jwtToken,
        };
        }

    @Get("whoami")
    @UseGuards(JwtAuthenticationGuard)
    async whoami(@Req() req, @Res() res: Response) {
        return res.json({
            userId: req.user.userId,
            username: req.user.username,
        });
    }
}
