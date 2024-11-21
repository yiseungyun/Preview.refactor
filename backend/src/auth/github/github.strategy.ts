// github-auth.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request } from "express";
import axios from "axios";
import "dotenv/config";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    private static REQUEST_ACCESS_TOKEN_URL =
        "https://github.com/login/oauth/access_token";
    private static REQUEST_USER_URL = "https://api.github.com/user";

    constructor() {
        super();
    }

    async validate(req: Request, done: any) {
        const { code } = req.body;

        if (!code) {
            throw new UnauthorizedException("Authorization code not found");
        }

        const tokenResponse = await axios.post(
            GithubStrategy.REQUEST_ACCESS_TOKEN_URL,
            {
                client_id: process.env.OAUTH_GITHUB_ID,
                client_secret: process.env.OAUTH_GITHUB_SECRET,
                code: code,
            },
            {
                headers: { Accept: "application/json" },
            }
        );

        const { access_token } = tokenResponse.data;

        // GitHub 사용자 정보 조회
        const userResponse = await axios.get(GithubStrategy.REQUEST_USER_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return done(null, {
            profile: userResponse.data,
        });
    }
}
