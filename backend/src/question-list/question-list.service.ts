import { Injectable } from "@nestjs/common";
import { QuestionListRepository } from "./question-list.repository";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { QuestionDto } from "./dto/question.dto";
import { QuestionListDto } from "./dto/question-list.dto";

@Injectable()
export class QuestionListService {
    constructor(
        private readonly questionListRepository: QuestionListRepository
    ) {}

    // 질문 생성 메서드
    async createQuestionList(createQuestionListDto: CreateQuestionListDto) {
        const { title, categoryNames, isPublic, userId } =
            createQuestionListDto;
        const categories =
            await this.questionListRepository.findCategoriesByNames(
                categoryNames
            );

        if (categories.length !== categoryNames.length) {
            throw new Error("Some category names were not found.");
        }

        const questionListDto: QuestionListDto = {
            title,
            categories,
            isPublic,
            userId,
        };

        return this.questionListRepository.createQuestionList(questionListDto);
    }

    async createQuestions(createQuestionDto: CreateQuestionDto) {
        const { contents, questionListId } = createQuestionDto;
        const questionDtos = contents.map((content, index) => {
            const question: QuestionDto = {
                content,
                index,
                questionListId,
            };

            return question;
        });

        return await this.questionListRepository.createQuestions(questionDtos);
    }
}
