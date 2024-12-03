import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";
import "dotenv/config";
import { JwtService } from "../jwt.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private readonly jwtService: JwtService) {
        super({
            jwtFromRequest: (req: Request) => {
                if (!req || !req.cookies) return null;
                return req.cookies["refreshToken"];
            },
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const { aud, exp } = payload;

        if (!exp || exp < Date.now()) throw new UnauthorizedException();

        const refreshToken = req.cookies["refreshToken"];

        const accessToken = await this.jwtService.getNewAccessToken(parseInt(aud), refreshToken);

        return {
            jwtToken: {
                accessToken,
                refreshToken: {
                    token: refreshToken,
                    expireTime: exp,
                },
            },
        };
    }
}
