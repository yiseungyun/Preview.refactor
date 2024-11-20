import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import {
    IJwtPayload as IJwtPayload,
    IJwtTokenPair as IJwtTokenPair,
    IJwtToken as IJwtToken,
} from "./jwt.model";

export const JwtPayload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const payload = request.user.jwtToken;

        if (!isJwtTokenPayload(payload)) {
            throw new UnauthorizedException("Invalid jwt token payload");
        }

        return payload;
    }
);

export const JwtTokenPair = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const payload = request.user.jwtToken;

        if (!isJwtTokenPair(payload)) {
            throw new InternalServerErrorException("Invalid jwt token");
        }

        return payload;
    }
);

function isJwtTokenPayload(payload: any): payload is IJwtPayload {
    return (
        payload &&
        typeof payload.userId === "number" &&
        typeof payload.username === "string"
    );
}

function isJwtTokenPair(payload: any): payload is IJwtTokenPair {
    if (!payload.accessToken || !payload.refreshToken) return false;
    if (!isJwtToken(payload.accessToken)) return false;
    if (!isJwtToken(payload.refreshToken)) return false;
    return true;
}

function isJwtToken(token: any): token is IJwtToken {
    return (
        token &&
        typeof token.token === "string" &&
        typeof token.expireTime === "number"
    );
}
