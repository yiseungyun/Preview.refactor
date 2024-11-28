import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@/auth/jwt/jwt.service";
import { AuthService } from "@/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) {
        super({
            usernameField: "userId",
            passwordField: "password",
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.getUserByLocal(username, password);

        if (!user) throw new UnauthorizedException("Invalid User login!");
        const token = await this.jwtService.createJwtToken(user);

        return {
            jwtToken: token,
        };
    }
}
