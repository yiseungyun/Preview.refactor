import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../../user/user.repository";
import "dotenv/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
        });
    }

    async validate(payload: any) {
        const { userId } = payload;
        const user = await this.userRepository.getUserByUserId(userId);
        if (!user) {
            throw new UnauthorizedException({ message: "user not exists." });
        }

        return {
            userId: user.id,
            username: user.username,
        };
    }
}
