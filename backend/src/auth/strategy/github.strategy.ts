// github-auth.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request } from "express";
import axios from "axios";
import "dotenv/config";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor() {
        super();
    }

    async validate(req: Request, done: any) {
        console.log(req.body);
        const code = req.body.code;

        if (!code) {
            throw new UnauthorizedException("Authorization code not found");
        }

        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.OAUTH_GITHUB_ID,
                client_secret: process.env.OAUTH_GITHUB_SECRET,
                code: code,
            },
            {
                headers: { Accept: "application/json" },
            }
        );

        console.log("토큰 받아오기 성공");
        const { access_token } = tokenResponse.data;

        console.log(access_token);
        // GitHub 사용자 정보 조회
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        console.log("잘됨?", userResponse.data.id);

        return done(null, {
            profile: userResponse.data,
        });
    }
}
