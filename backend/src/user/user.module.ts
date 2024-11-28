import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserService } from "@/user/user.service";
import { AuthService } from "@/auth/auth.service";
import { JwtModule } from "@/auth/jwt/jwt.module";
import { UserController } from "@/user/user.controller";

@Module({
    imports: [JwtModule],
    controllers: [UserController],
    providers: [UserRepository, UserService, AuthService],
})
export class UserModule {}
