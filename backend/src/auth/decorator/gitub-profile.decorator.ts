import {
    createParamDecorator,
    ExecutionContext,
    BadRequestException,
} from "@nestjs/common";
import { Profile } from "passport-github";

export const GithubProfile = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user.profile;

        // GitHub Profile 타입 검증
        if (!isGithubProfile(user)) {
            throw new BadRequestException("Invalid GitHub profile");
        }

        return user;
    }
);

function isGithubProfile(user: any): user is Profile {
    return user && typeof user.id === "number";
}
