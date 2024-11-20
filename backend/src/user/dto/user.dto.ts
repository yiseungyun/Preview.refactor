export interface UserDto {
    loginId?: string;
    passwordHash?: string;
    githubId?: number;
    username: string;
    refreshToken: string;
}
