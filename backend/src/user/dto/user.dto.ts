import { QuestionList } from "@/question-list/entity/question-list.entity";
import { LoginType } from "@/user/user.entity";

export interface UserDto {
    loginId?: string;
    loginType: LoginType;
    passwordHash?: string;
    githubId?: number;
    username: string;
    refreshToken: string;
    scrappedQuestionLists: QuestionList[];
}

export interface UserInternalDto {
    id: number;
    loginId?: string;
    loginType: LoginType;
    passwordHash?: string;
    githubId?: number;
    username: string;
    refreshToken: string;
    scrappedQuestionLists: QuestionList[];
}
