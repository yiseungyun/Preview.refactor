import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubStrategy } from "../config/github.strategy";
import { UserRepository } from "../user/user.repository";

@Module({
    controllers: [AuthController],
    providers: [AuthService, GithubStrategy, UserRepository],
})
export class AuthModule {}
