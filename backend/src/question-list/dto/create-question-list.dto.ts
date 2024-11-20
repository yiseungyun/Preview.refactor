export interface CreateQuestionListDto {
    title: string;
    categoryNames: string[];
    isPublic: boolean;
    userId: number;
}
