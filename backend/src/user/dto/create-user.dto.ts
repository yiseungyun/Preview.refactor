export interface CreateUserDto {
    loginId?: string;
    passwordHash?: string;
    githubId?: number;
    username: string;
}
