import { Injectable } from "@nestjs/common";
import { QuestionListRepository } from "./question-list.repository";
import { UserRepository } from "@/user/user.repository";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { GetAllQuestionListDto } from "./dto/get-all-question-list.dto";
import { QuestionListContentsDto } from "./dto/question-list-contents.dto";
import { MyQuestionListDto } from "./dto/my-question-list.dto";
import { Question } from "./question.entity";
import { Transactional } from "typeorm-transactional";
import { QuestionList } from "@/question-list/question-list.entity";
import { paginate, PaginateQuery } from "nestjs-paginate";

@Injectable()
export class QuestionListService {
    constructor(
        private readonly questionListRepository: QuestionListRepository,
        private readonly userRepository: UserRepository
    ) {}

    async getAllQuestionLists(query: PaginateQuery) {
        const allQuestionLists: GetAllQuestionListDto[] = [];

        const publicQuestionLists = await this.questionListRepository.findPublicQuestionLists();
        const result = await paginate(query, publicQuestionLists, {
            sortableColumns: ["usage"],
            defaultSortBy: [["usage", "DESC"]],
        });

        for (const publicQuestionList of result.data) {
            const { id, title, usage } = publicQuestionList;
            const categoryNames: string[] =
                await this.questionListRepository.findCategoryNamesByQuestionListId(id);

            const questionCount =
                await this.questionListRepository.getQuestionCountByQuestionListId(id);

            const questionList: GetAllQuestionListDto = {
                id,
                title,
                categoryNames,
                usage,
                questionCount,
            };
            allQuestionLists.push(questionList);
        }
        return { allQuestionLists, meta: result.meta };
    }

    async getAllQuestionListsByCategoryName(categoryName: string, query: PaginateQuery) {
        const allQuestionLists: GetAllQuestionListDto[] = [];

        const categoryId = await this.questionListRepository.getCategoryIdByName(categoryName);

        if (!categoryId) {
            return {};
        }

        const publicQuestionLists =
            await this.questionListRepository.findPublicQuestionListsByCategoryId(categoryId);
        const result = await paginate(query, publicQuestionLists, {
            sortableColumns: ["usage"],
            defaultSortBy: [["usage", "DESC"]],
        });

        for (const publicQuestionList of result.data) {
            const { id, title, usage } = publicQuestionList;
            const categoryNames: string[] =
                await this.questionListRepository.findCategoryNamesByQuestionListId(id);

            const questionCount =
                await this.questionListRepository.getQuestionCountByQuestionListId(id);

            const questionList: GetAllQuestionListDto = {
                id,
                title,
                categoryNames,
                usage,
                questionCount,
            };
            allQuestionLists.push(questionList);
        }
        return { allQuestionLists, meta: result.meta };
    }

    // 질문 생성 메서드
    @Transactional()
    async createQuestionList(createQuestionListDto: CreateQuestionListDto) {
        const { title, contents, categoryNames, isPublic, userId } = createQuestionListDto;

        const categories = await this.questionListRepository.findCategoriesByNames(categoryNames);
        if (categories.length !== categoryNames.length) {
            throw new Error("Some category names were not found.");
        }

        const questionList = new QuestionList();
        questionList.title = title;
        questionList.categories = categories;
        questionList.isPublic = isPublic;
        questionList.userId = userId;

        const createdQuestionList =
            await this.questionListRepository.createQuestionList(questionList);

        const questions = contents.map((content, index) => {
            const question = new Question();
            question.content = content;
            question.index = index;
            question.questionList = createdQuestionList;

            return question;
        });

        const createdQuestions = await this.questionListRepository.createQuestions(questions);
        return { createdQuestionList, createdQuestions };
    }

    async getQuestionListContents(questionListId: number, query: PaginateQuery) {
        const questionList = await this.questionListRepository.getQuestionListById(questionListId);
        const { id, title, usage, isPublic, userId } = questionList;
        if (!isPublic) {
            throw new Error("This is private question list.");
        }

        const contents =
            await this.questionListRepository.getContentsByQuestionListId(questionListId);
        const result = await paginate(query, contents, {
            sortableColumns: ["index"],
            defaultSortBy: [["index", "ASC"]],
        });

        const categoryNames =
            await this.questionListRepository.findCategoryNamesByQuestionListId(questionListId);

        const username = await this.questionListRepository.getUsernameById(userId);
        const questionListContents: QuestionListContentsDto = {
            id,
            title,
            contents: result.data,
            categoryNames,
            usage,
            username,
        };

        return { questionListContents, meta: result.meta };
    }

    async getMyQuestionLists(userId: number) {
        const questionLists = await this.questionListRepository.getQuestionListsByUserId(userId);

        const myQuestionLists: MyQuestionListDto[] = [];
        for (const myQuestionList of questionLists) {
            const { id, title, isPublic, usage } = myQuestionList;
            const categoryNames: string[] =
                await this.questionListRepository.findCategoryNamesByQuestionListId(id);

            const questionList: MyQuestionListDto = {
                id,
                title,
                categoryNames,
                isPublic,
                usage,
            };
            myQuestionLists.push(questionList);
        }
        return myQuestionLists;
    }

    async findCategoriesByNames(categoryNames: string[]) {
        const categories = await this.questionListRepository.findCategoriesByNames(categoryNames);

        if (categories.length !== categoryNames.length) {
            throw new Error("Some category names were not found.");
        }

        return categories;
    }

    async getScrappedQuestionLists(userId: number) {
        const user = await this.userRepository.getUserByUserId(userId);
        return await this.questionListRepository.getScrappedQuestionListsByUser(user);
    }

    async scrapQuestionList(questionListId: number, userId: number) {
        const user = await this.userRepository.getUserByUserId(userId);

        // 유효한 question list id 인지 확인
        const questionList = await this.questionListRepository.getQuestionListById(questionListId);
        if (!questionList) throw new Error("Question list not found.");

        // 스크랩하려는 질문지가 내가 만든 질문지인지 확인
        const myQuestionLists = await this.questionListRepository.getQuestionListsByUserId(userId);
        const isMyQuestionList = myQuestionLists.some((list) => list.id === questionListId);
        if (isMyQuestionList) throw new Error("Can't scrap my question list.");

        // 스크랩하려는 질문지가 이미 스크랩한 질문지인지 확인
        const alreadyScrappedQuestionLists =
            await this.questionListRepository.getScrappedQuestionListsByUser(user);
        const isAlreadyScrapped = alreadyScrappedQuestionLists.some(
            (list) => list.id === questionListId
        );
        if (isAlreadyScrapped) throw new Error("This question list is already scrapped.");

        // 질문지 스크랩
        await this.questionListRepository.scrapQuestionList(questionListId, userId);

        return questionList;
    }

    async unscrapQuestionList(questionListId: number, userId: number) {
        return await this.questionListRepository.unscrapQuestionList(questionListId, userId);
    }
}
