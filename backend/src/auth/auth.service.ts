import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { Transactional } from "typeorm-transactional";
import { JwtService } from "@nestjs/jwt";
import "dotenv/config";
import { Response } from "express";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}

    @Transactional()
    async githubLogin(req: any, res: Response) {
        try {
            // 유저 가져오기
            let user = await this.userRepository.getUserByGithubId(
                req.user.githubId
            );

            // 없는 유저면 DB에 유저 정보 저장
            if (!user) {
                user = await this.userRepository.createUser({
                    githubId: req.user.githubId,
                    username: req.user.username,
                });
            }

            // access token, refresh token 발급
            const userPayload = {
                userId: user.id,
                username: user.username,
            };
            const accessToken = this.jwtService.sign(userPayload, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
            });

            const refreshToken = this.jwtService.sign(
                {},
                {
                    secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
                    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
                    audience: String(user.id),
                }
            );

            // DB의 user 테이블의 refresh 필드 업데이트
            user.refreshToken = refreshToken;
            await this.userRepository.updateUser(user);

            // refresh token을 쿠키에 넣어서 전달해주기
            const expires = new Date();
            expires.setDate(
                expires.getDate() +
                    +process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
            );

            res.cookie("refreshToken", refreshToken, {
                // expires, // option expires is invalid 라는 에러가 뜨는데 어케 해결할지 모르겠음
            });
            return accessToken;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
