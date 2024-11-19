import { Injectable } from "@nestjs/common";
import { QuestionList } from "./question-list.entity";
import { Question } from "./question.entity";
import { QuestionListRepository } from "./question-list.repository";

@Injectable()
export class QuestionListService {
    constructor(private readonly questionRepository: QuestionListRepository) {}


    // 질문 생성 메서드
    async createQuestionList(title: string, isPublic: boolean, userId: number) {
        const questionList = new QuestionList();
        questionList.title = title;
        questionList.isPublic = isPublic;
        questionList.userId = userId;

        return this.questionRepository.createQuestionList(questionList);
    }

    async createQuestions(questionListId: number, questions: string[]) {
        let index = 0;
        const questionEntities = questions.map((questionContent) => {
            const question = new Question();
            question.content = questionContent;
            question.index = index++;
            question.questionListId = questionListId;

            return question;
        });

        await this.questionRepository.createQuestions(questionEntities);
    }
}
