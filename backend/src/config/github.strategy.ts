import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import "dotenv/config";
import { Profile, Strategy } from "passport-github";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.OAUTH_GITHUB_ID, // CLIENT_ID
            clientSecret: process.env.OAUTH_GITHUB_SECRET, // CLIENT_SECRET
            callbackURL: process.env.OAUTH_GITHUB_CALLBACK, // redirect_uri
            passReqToCallback: true,
            scope: ["profile"], // 가져올 정보들
        });
    }

    /**
     * GitHub에서 반환된 프로필 데이터를 가공
     * @param request
     * @param accessToken
     * @param refreshToken
     * @param profile
     * @param done
     */
    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
    ) {
        try {
            const user = await this.authService.githubLogin(profile);
            console.log(user);
            done(null, user);
        } catch (err) {
            console.error(err);
            done(err, false);
        }
    }
}
