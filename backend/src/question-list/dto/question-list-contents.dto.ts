import { Question } from "../question.entity";

export interface QuestionListContentsDto {
    id: number;
    title: string;
    categoryNames: string[];
    contents: Question[];
    usage: number;
    userId: number;
}
