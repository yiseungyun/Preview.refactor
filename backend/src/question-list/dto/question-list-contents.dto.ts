import { Question } from "../entity/question.entity";

export interface QuestionListContentsDto {
    id: number;
    title: string;
    categoryNames: string[];
    contents: Question[];
    usage: number;
    username: string;
    isScrap: boolean;
}
