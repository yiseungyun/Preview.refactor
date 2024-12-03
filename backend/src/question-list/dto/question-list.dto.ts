import { QuestionList } from "@/question-list/entity/question-list.entity";

export class QuestionListDto extends QuestionList {
    categoryNames?: string[];
}
