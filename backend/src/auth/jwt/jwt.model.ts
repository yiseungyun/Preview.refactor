export interface IJwtPayload {
    userId: number;
    username: string;
}

export interface IJwtToken {
    token: string;
    expireTime: number;
}

export interface IJwtTokenPair {
    accessToken: IJwtToken;
    refreshToken: IJwtToken;
}
