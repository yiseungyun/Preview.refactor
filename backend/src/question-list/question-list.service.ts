import { Injectable } from "@nestjs/common";
import { QuestionListRepository } from "./question-list.repository";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { QuestionDto } from "./dto/question.dto";
import { QuestionListDto } from "./dto/question-list.dto";
import { GetAllQuestionListDto } from "./dto/get-all-question-list.dto";
import { QuestionListContentsDto } from "./dto/question-list-contents.dto";

@Injectable()
export class QuestionListService {
    constructor(
        private readonly questionListRepository: QuestionListRepository
    ) {}

    async getAllQuestionLists() {
        const allQuestionLists: GetAllQuestionListDto[] = [];

        const publicQuestionLists =
            await this.questionListRepository.findPublicQuestionLists();

        for (const publicQuestionList of publicQuestionLists) {
            const { id, title } = publicQuestionList;
            const categoryNames: string[] =
                await this.questionListRepository.findCategoryNamesByQuestionListId(
                    id
                );

            const questionList: GetAllQuestionListDto = {
                id,
                title,
                categoryNames,
            };
            allQuestionLists.push(questionList);
        }
        return allQuestionLists;
    }

    async getAllQuestionListsByCategoryName(categoryName: string) {
        const allQuestionLists: GetAllQuestionListDto[] = [];

        const categoryId =
            await this.questionListRepository.getCategoryIdByName(categoryName);

        if (!categoryId) {
            return [];
        }

        const publicQuestionLists =
            await this.questionListRepository.findPublicQuestionListsByCategoryId(
                categoryId
            );

        for (const publicQuestionList of publicQuestionLists) {
            const { id, title } = publicQuestionList;
            const categoryNames: string[] =
                await this.questionListRepository.findCategoryNamesByQuestionListId(
                    id
                );

            const questionList: GetAllQuestionListDto = {
                id,
                title,
                categoryNames,
            };
            allQuestionLists.push(questionList);
        }
        return allQuestionLists;
    }

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

    async getQuestionListContents(questionListId: number) {
        const questionList =
            await this.questionListRepository.getQuestionListById(
                questionListId
            );
        const { id, title, usage, userId } = questionList;

        const contents =
            await this.questionListRepository.getContentsByQuestionListId(
                questionListId
            );

        const categoryNames =
            await this.questionListRepository.findCategoryNamesByQuestionListId(
                questionListId
            );

        const username =
            await this.questionListRepository.getUsernameById(userId);

        const questionListContents: QuestionListContentsDto = {
            id,
            title,
            contents,
            categoryNames,
            usage,
            username,
        };

        return questionListContents;
    }
}
