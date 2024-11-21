import { JwtService as ParentService } from "@nestjs/jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { UserRepository } from "../../user/user.repository";
import { DAY, HOUR } from "../../utils/time";
import { User } from "../../user/user.entity";
import { IJwtToken } from "./jwt.model";

@Injectable()
export class JwtService {
    private static ACCESS_TOKEN_TIME = 3 * HOUR;
    private static REFRESH_TOKEN_TIME = 10 * DAY;

    constructor(
        private readonly parent: ParentService,
        private readonly userRepository: UserRepository
    ) {}

    @Transactional()
    public async createJwtToken(id: number) {
        const user = await this.userRepository.getUserByUserId(id);

        const accessToken = await this.createAccessToken(user);
        const refreshToken = await this.createRefreshToken(id);

        user.refreshToken = refreshToken.token;

        await this.userRepository.updateUser(user);

        return {
            accessToken,
            refreshToken,
        };
    }

    public async createAccessToken(user: User): Promise<IJwtToken> {
        const accessToken = this.parent.sign(
            {
                userId: user.id,
                username: user.username,
            },
            {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
            }
        );

        return {
            token: accessToken,
            expireTime: Date.now() + JwtService.ACCESS_TOKEN_TIME,
        };
    }

    public async createRefreshToken(id: number): Promise<IJwtToken> {
        const refreshToken = this.parent.sign(
            {},
            {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
                audience: String(id),
            }
        );

        return {
            token: refreshToken,
            expireTime: Date.now() + JwtService.REFRESH_TOKEN_TIME,
        };
    }

    public async getNewAccessToken(id: number, refreshToken: string) {
        const user = await this.userRepository.getUserByUserId(id);

        if (!user) throw new UnauthorizedException("Invalid refresh token");
        if (user.refreshToken !== refreshToken)
            throw new UnauthorizedException("Refresh token expired!");

        return this.createAccessToken(user);
    }
}
