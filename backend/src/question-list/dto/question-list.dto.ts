import { Category } from "../category.entity";

export interface QuestionListDto {
    title: string;
    categories: Category[];
    isPublic: boolean;
    userId: number;
}