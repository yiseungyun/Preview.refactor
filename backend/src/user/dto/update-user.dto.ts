import { IsString, MaxLength } from "class-validator";
import { User } from "@/user/user.entity";

export interface ChangePassword {
    original: string;
    newPassword: string;
}

export class UpdateUserDto {
    @IsString()
    @MaxLength(User.USERNAME_MAX_LEN)
    nickname?: string;

    @IsString()
    @MaxLength(User.URL_MAX_LEN)
    avatarUrl?: string;

    password?: ChangePassword;
}
