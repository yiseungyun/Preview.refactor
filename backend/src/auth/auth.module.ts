import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubStrategy } from "./github/github.strategy";
import { UserRepository } from "@/user/user.repository";
import { JwtModule } from "./jwt/jwt.module";
import { LocalStrategy } from "@/auth/local/local.strategy";
import { UserService } from "@/user/user.service";

@Module({
    imports: [JwtModule],
    controllers: [AuthController],
    providers: [AuthService, GithubStrategy, LocalStrategy, UserRepository, UserService],
})
export class AuthModule {}
