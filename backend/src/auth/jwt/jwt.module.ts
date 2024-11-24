import { Module } from "@nestjs/common";
import { JwtModule as ParentJwtModule } from "@nestjs/jwt";
import { JwtService } from "./jwt.service";
import { UserRepository } from "../../user/user.repository";
import { AccessTokenStrategy } from "./strategy/access-token.strategy";
import { RefreshTokenStrategy } from "./strategy/refresh-token.strategy";

@Module({
    imports: [ParentJwtModule.register({})],
    providers: [
        JwtService,
        UserRepository,
        AccessTokenStrategy,
        RefreshTokenStrategy,
    ],
    exports: [JwtService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class JwtModule {}
