import { LoginType } from "@/user/user.entity";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    nickname: string;
}

export interface CreateUserInternalDto {
    loginId?: string;
    passwordHash?: string;
    githubId?: number;
    username: string;
    loginType: LoginType;
}
