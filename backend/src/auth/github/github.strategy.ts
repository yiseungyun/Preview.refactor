// github-auth.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request } from "express";
import axios from "axios";
import "dotenv/config";
import { AuthService } from "@/auth/auth.service";
import { JwtService } from "@/auth/jwt/jwt.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    private static REQUEST_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
    private static REQUEST_USER_URL = "https://api.github.com/user";

    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) {
        super();
    }

    async validate(req: Request) {
        const { code } = req.body;

        if (!code) {
            throw new UnauthorizedException("Authorization code not found");
        }

        const { access_token: accessToken } = (await this.fetchAccessToken(code)).data;

        const profile = (await this.fetchGithubUser(accessToken)).data;

        const user = await this.authService.getUserByGithubId(profile.id);
        const token = await this.jwtService.createJwtToken(user);

        return {
            jwtToken: token,
        };
    }

    private async fetchAccessToken(code: string) {
        return axios.post(
            GithubStrategy.REQUEST_ACCESS_TOKEN_URL,
            {
                client_id: process.env.OAUTH_GITHUB_ID,
                client_secret: process.env.OAUTH_GITHUB_SECRET,
                code,
            },
            {
                headers: { Accept: "application/json" },
            }
        );
    }

    private async fetchGithubUser(accessToken: string) {
        return axios.get(GithubStrategy.REQUEST_USER_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
}
