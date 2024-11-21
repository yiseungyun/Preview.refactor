export interface CreateQuestionListDto {
    title: string;
    contents: string[];
    categoryNames: string[];
    isPublic: boolean;
    userId: number;
}
