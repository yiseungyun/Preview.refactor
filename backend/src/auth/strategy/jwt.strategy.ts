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
        const { githubId } = payload;
        const user = await this.userRepository.getUserByGithubId(githubId);
        if (!user) {
            throw new UnauthorizedException({ message: "user not exists." });
        }

        return {
            githubId: user.githubId,
            username: user.username,
        };
    }
}
