export interface GetAllQuestionListDto {
    id: number;
    title: string;
    categoryNames: string[];
    usage: number;
    questionCount: number;
    isScrap: boolean;
}
