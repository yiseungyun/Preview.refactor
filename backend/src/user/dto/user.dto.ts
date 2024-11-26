import { QuestionList } from "@/question-list/question-list.entity";

export interface UserDto {
    loginId?: string;
    passwordHash?: string;
    githubId?: number;
    username: string;
    refreshToken: string;
    scrappedQuestionLists: QuestionList[];
}
