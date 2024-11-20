import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { Transactional } from "typeorm-transactional";
// import { JwtService } from "@nestjs/jwt";
// import { CreateJwtTokenDto } from "./dto/create-jwt-token.dto";
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
    public async getUserByGithubId(id: number) {
        const user = await this.userRepository.getUserByGithubId(id);

        if (!user)
            return await this.userRepository.createUser({
                githubId: id,
                username: `camper_${id}`,
            });

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
