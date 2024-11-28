export interface UpdateQuestionListDto {
    id: number;
    title?: string;
    categoryNames?: string[];
    isPublic?: boolean;
    userId: number;
}
