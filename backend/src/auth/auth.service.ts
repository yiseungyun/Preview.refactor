import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { Transactional } from "typeorm-transactional";
import "dotenv/config";
import { DAY, HOUR } from "../utils/time";
import { JwtService } from "./jwt/jwt.service";

@Injectable()
export class AuthService {
    private static ACCESS_TOKEN_EXPIRATION_TIME = 3 * HOUR;
    private static ACCESS_TOKEN_EXPIRATION = 30 * DAY;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}

    @Transactional()
    public async getTokenByGithubId(id: number) {
        let user = await this.userRepository.getUserByGithubId(id);

        if (!user) {
            user = await this.userRepository.createUser({
                githubId: id,
                username: `camper_${id}`,
            });
        }

        return await this.jwtService.createJwtToken(user.id);
    }
}
