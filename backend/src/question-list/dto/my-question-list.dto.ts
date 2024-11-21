import { Question } from "../question.entity";

export interface MyQuestionListDto {
    id: number;
    title: string;
    contents: Question[];
    categoryNames: string[];
    isPublic: boolean;
    usage: number;
}