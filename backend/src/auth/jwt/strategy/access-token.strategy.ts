import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";
import "dotenv/config";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                if (!req || !req.cookies) return null;
                return req.cookies["accessToken"];
            },
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const { userId, username } = payload;

        return {
            jwtToken: {
                userId,
                username,
            },
        };
    }
}
