import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    async validate(req: Request) {
        try {
            const token = req.cookies?.accessToken;

            if (!token) return { jwtToken: null };

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
            const { userId, username } = decoded as any;

            return {
                jwtToken: {
                    userId,
                    username,
                },
            };
        } catch {
            return { jwtToken: null };
        }
    }
}
