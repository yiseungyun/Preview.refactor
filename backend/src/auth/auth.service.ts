import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { Profile } from "passport-github";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    @Transactional()
    public async githubLogin(profile: Profile) {
        const user = await this.userRepository.getUserByGithubId(
            parseInt(profile.id)
        );

        if (!user)
            return await this.userRepository.createUser({
                githubId: parseInt(profile.id),
                username: `camper_${profile.id}`,
            });

        return user;
    }

    // public oauthLogin(code: string) {
    //     // 1. GitHub OAuth 토큰 획득
    //     const accessToken = githubClient.getAccessToken(code);
    //
    //     // 1. User DB를 토큰이나, 깃허브 사용자 정보를 통해서 재구성하는 행위
    //     // 2. nickname => 캠퍼_{github_username}
    //     // 3. id => AUTO INCREMENT, password => null
    //     // 4. user_id => null
    //
    //     // 2. GitHub API로 사용자 정보 조회
    //     const userInfo = githubClient.getUserInfo(accessToken);
    //
    //     // 3. 자체 DB에 사용자 정보 저장
    //     const user = userRepository.findByGithubId(userInfo.getId())
    //         .orElseGet(() -> createUser(userInfo));
    //
    //     // 4. JWT 발급 (자체 서비스용)
    //     const jwt = jwtProvider.generateToken(user);
    //
    //     return new UserResponse(user, jwt);
    // }
}
