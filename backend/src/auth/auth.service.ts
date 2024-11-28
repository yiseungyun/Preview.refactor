import { Injectable } from "@nestjs/common";
import { UserRepository } from "@/user/user.repository";
import { Transactional } from "typeorm-transactional";
import "dotenv/config";
import { JwtService } from "./jwt/jwt.service";
import { LoginType } from "@/user/user.entity";
import { createHash } from "node:crypto";

@Injectable()
export class AuthService {
    private static PASSWORD_SALT = process.env.PASSWORD_SALT;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}

    @Transactional()
    public async getUserByGithubId(id: number) {
        let user = await this.userRepository.getUserByGithubId(id);

        if (!user)
            user = await this.userRepository.createUser({
                githubId: id,
                username: `camper_${id}`,
                loginType: LoginType.GITHUB,
            });

        return user;
    }

    public async getUserByLocal(username: string, password: string) {
        const user = await this.userRepository.getUserByLoginId(username);
        if (!user) return null;
        if (user.passwordHash !== this.generatePasswordHash(password)) return null;

        return user;
    }

    public generatePasswordHash(password: string) {
        return createHash("sha256")
            .update(password + process.env.SESSION_HASH)
            .digest("hex");
    }
}
