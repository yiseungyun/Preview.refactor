import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { Transactional } from "typeorm-transactional";
// import { JwtService } from "@nestjs/jwt";
// import { CreateJwtTokenDto } from "./dto/create-jwt-token.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository
        // private readonly jwtService: JwtService
    ) {}

    @Transactional()
    public async getUserByGithubId(id: number) {
        const user = await this.userRepository.getUserByGithubId(id);

        if (!user)
            return await this.userRepository.createUser({
                githubId: id,
                username: `camper_${id}`,
            });

        return user;
    }

    // public async createJwtToken(userPayload: CreateJwtTokenDto) {
    //     const accessToken = this.jwtService.sign(
    //         {
    //             id: userPayload.id,
    //             username: userPayload.username,
    //         },
    //         {
    //             secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    //             expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    //         }
    //     );
    //
    //     const refreshToken = this.jwtService.sign(
    //         {},
    //         {
    //             secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    //             expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    //             audience: String(userPayload.userId),
    //         }
    //     );
    //
    //     return {
    //         accessToken,
    //         refreshToken,
    //     };
    // }
}
