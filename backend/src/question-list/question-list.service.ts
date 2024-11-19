import { Injectable } from "@nestjs/common";
import { QuestionListRepository } from "./question-list.repository";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { QuestionDto } from "./dto/question.dto";

@Injectable()
export class QuestionListService {
    constructor(private readonly questionRepository: QuestionListRepository) {}

    // 질문 생성 메서드
    async createQuestionList(createQuestionListDto: CreateQuestionListDto) {
        return this.questionRepository.createQuestionList(
            createQuestionListDto
        );
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

        return await this.questionRepository.createQuestions(questionDtos);
    }
}
