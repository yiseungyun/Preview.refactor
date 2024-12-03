import { Injectable } from "@nestjs/common";
import { QuestionListRepository } from "./repository/question-list.repository";
import { UserRepository } from "@/user/user.repository";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { GetAllQuestionListDto } from "./dto/get-all-question-list.dto";
import { QuestionListContentsDto } from "./dto/question-list-contents.dto";
import { MyQuestionListDto } from "./dto/my-question-list.dto";
import { Question } from "./entity/question.entity";
import { QuestionList } from "@/question-list/entity/question-list.entity";
import { UpdateQuestionListDto } from "@/question-list/dto/update-question-list.dto";
import { QuestionDto } from "@/question-list/dto/question.dto";
import { DeleteQuestionDto } from "@/question-list/dto/delete-question.dto";
import { QuestionRepository } from "@/question-list/repository/question.respository";
import { CategoryRepository } from "@/question-list/repository/category.repository";
import { PaginateQueryDto } from "@/question-list/dto/paginate-query.dto";
import { DataSource, In, SelectQueryBuilder } from "typeorm";
import { PaginateMetaDto } from "@/question-list/dto/paginate-meta.dto";
import { PaginateDto } from "@/question-list/dto/paginate.dto";
import { QuestionListDto } from "@/question-list/dto/question-list.dto";

@Injectable()
export class QuestionListService {
    constructor(
        private dataSource: DataSource,
        private readonly questionListRepository: QuestionListRepository,
        private readonly questionRepository: QuestionRepository,
        private readonly userRepository: UserRepository,
        private readonly categoryRepository: CategoryRepository
    ) {}

    async getAllQuestionLists(query: PaginateQueryDto, userId: number) {
        const allQuestionLists: GetAllQuestionListDto[] = [];

        let categoryId = null;
        if (query.category) {
            const category = await this.categoryRepository.findOne({
                where: { name: query.category },
            });
            categoryId = category.id;
            if (!categoryId) return {};
        }

        const publicQuestionLists =
            await this.questionListRepository.findPublicQuestionLists(categoryId);
        const result = await this.paginate(query, publicQuestionLists);

        for (const publicQuestionList of result.data) {
            const { id, title, usage } = publicQuestionList;
            const categoryNames: string[] =
                await this.categoryRepository.findCategoryNamesByQuestionListId(id);

            const questionCount = await this.questionRepository.count({
                where: { questionListId: id },
            });

            const isScrap = await this.questionListRepository.isQuestionListScrapped(id, userId);

            const questionList: GetAllQuestionListDto = {
                id,
                title,
                categoryNames,
                usage,
                questionCount,
                isScrap,
            };
            allQuestionLists.push(questionList);
        }
        return { allQuestionLists, meta: result.meta };
    }

    // 질문 생성 메서드
    async createQuestionList(createQuestionListDto: CreateQuestionListDto) {
        const { title, contents, categoryNames, isPublic, userId } = createQuestionListDto;

        const categories = await this.categoryRepository.find({
            where: { name: In(categoryNames) },
        });
        if (categories.length !== categoryNames.length) {
            throw new Error("Some category names were not found.");
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const questionList = new QuestionList();
            questionList.title = title;
            questionList.categories = categories;
            questionList.isPublic = isPublic;
            questionList.userId = userId;

            const createdQuestionList = await queryRunner.manager.save(questionList);

            const questions = contents.map((content, index) => {
                const question = new Question();
                question.content = content;
                question.index = index;
                question.questionList = createdQuestionList;

                return question;
            });
            const createdQuestions = await queryRunner.manager.save(questions);

            await queryRunner.commitTransaction();
            return { createdQuestionList, createdQuestions };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(error.message);
        } finally {
            await queryRunner.release();
        }
    }

    async getQuestionListContents(questionListId: number, userId: number) {
        const questionList = await this.questionListRepository.findOne({
            where: { id: questionListId },
        });
        const { id, title, usage, isPublic } = questionList;
        if (!isPublic && questionList.userId !== userId) {
            throw new Error("This is private question list.");
        }

        const contents = await this.questionRepository.getContentsByQuestionListId(questionListId);

        const categoryNames =
            await this.categoryRepository.findCategoryNamesByQuestionListId(questionListId);

        const user = await this.userRepository.getUserByUserId(userId);
        const username = user.username;
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

    async getMyQuestionLists(userId: number, query: PaginateQueryDto) {
        const questionLists = await this.questionListRepository.getQuestionListsByUserId(userId);
        const result = await this.paginate(query, questionLists);

        const myQuestionLists: MyQuestionListDto[] = [];
        for (const myQuestionList of result.data) {
            const { id, title, isPublic, usage } = myQuestionList;
            const categoryNames: string[] =
                await this.categoryRepository.findCategoryNamesByQuestionListId(id);

            const questionList: MyQuestionListDto = {
                id,
                title,
                categoryNames,
                isPublic,
                usage,
            };
            myQuestionLists.push(questionList);
        }
        return { myQuestionLists, meta: result.meta };
    }

    async updateQuestionList(updateQuestionListDto: UpdateQuestionListDto) {
        const { id, title, categoryNames, isPublic, userId } = updateQuestionListDto;
        const user = await this.userRepository.getUserByUserId(userId);
        if (!user) throw new Error("User not found.");

        const questionList = await this.questionListRepository.findOne({
            where: { id },
        });
        if (!questionList) throw new Error("Question list not found.");
        if (questionList.userId !== userId)
            throw new Error("You do not have permission to edit this question list.");

        if (title) questionList.title = title;
        if (categoryNames) {
            questionList.categories = await this.categoryRepository.find({
                where: { name: In(categoryNames) },
            });
        }
        if (isPublic !== undefined) questionList.isPublic = isPublic;

        const updatedQuestionList: QuestionListDto =
            await this.questionListRepository.save(questionList);
        updatedQuestionList.categoryNames =
            await this.categoryRepository.findCategoryNamesByQuestionListId(id);
        updatedQuestionList.categories = undefined;

        return updatedQuestionList;
    }

    async deleteQuestionList(questionListId: number, userId: number) {
        const user = await this.userRepository.getUserByUserId(userId);
        if (!user) throw new Error("User not found.");

        const questionList = await this.questionListRepository.findOne({
            where: { id: questionListId },
        });
        if (!questionList) throw new Error("Question list not found.");
        if (questionList.userId !== userId)
            throw new Error("You do not have permission to delete this question list.");

        return await this.questionListRepository.delete(questionListId);
    }

    async addQuestion(questionDto: QuestionDto) {
        const { content, questionListId, userId } = questionDto;
        const user = await this.userRepository.getUserByUserId(userId);
        if (!user) throw new Error("User not found.");

        const questionList = await this.questionListRepository.findOne({
            where: { id: questionListId },
        });
        if (!questionList) throw new Error("Question list not found.");
        if (questionList.userId !== userId)
            throw new Error("You do not have permission to add a question to this question list.");

        const existingQuestionCount = await this.questionRepository.count({
            where: { questionListId },
        });
        const question = new Question();
        question.content = content;
        question.index = existingQuestionCount;
        question.questionListId = questionListId;

        await this.questionRepository.save(question);
        return await this.getQuestionListContents(questionListId, userId);
    }

    async updateQuestion(questionDto: QuestionDto) {
        const { id, content, questionListId, userId } = questionDto;

        const question = await this.questionRepository.findOne({
            where: { id },
        });
        if (!question) throw new Error("Question not found.");

        const user = await this.userRepository.getUserByUserId(userId);
        if (!user) throw new Error("User not found.");

        const questionList = await this.questionListRepository.findOne({
            where: { id: questionListId },
        });
        if (!questionList) throw new Error("Question list not found.");
        if (questionList.userId !== userId)
            throw new Error(
                "You do not have permission to update the question in this question list."
            );

        question.content = content;
        await this.questionRepository.save(question);

        return await this.getQuestionListContents(questionListId, userId);
    }

    async deleteQuestion(deleteQuestionDto: DeleteQuestionDto) {
        const { id, questionListId, userId } = deleteQuestionDto;

        const question = await this.questionRepository.findOne({
            where: { id },
        });
        if (!question) throw new Error("Question not found.");

        const user = await this.userRepository.getUserByUserId(userId);
        if (!user) throw new Error("User not found.");

        const questionList = await this.questionListRepository.findOne({
            where: { id: questionListId },
        });
        if (!questionList) throw new Error("Question list not found.");
        if (questionList.userId !== userId)
            throw new Error(
                "You do not have permission to delete the question in this question list."
            );

        const questionIndex = question.index;

        const questionsToUpdate = await this.questionRepository.getQuestionsAfterIndex(
            questionListId,
            questionIndex
        );

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (const q of questionsToUpdate) {
                q.index -= 1;
                await queryRunner.manager.save(q);
            }

            const result = await queryRunner.manager.delete(Question, question.id);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(error.message);
        } finally {
            await queryRunner.release();
        }
    }

    async getScrappedQuestionLists(userId: number, query: PaginateQueryDto) {
        const user = await this.userRepository.getUserByUserId(userId);
        const scrappedQuestionLists =
            await this.questionListRepository.getScrappedQuestionListsByUser(user);
        const result = await this.paginate(query, scrappedQuestionLists);
        return { scrappedQuestionLists: result.data, meta: result.meta };
    }

    async scrapQuestionList(questionListId: number, userId: number) {
        const user = await this.userRepository.getUserByUserId(userId);

        // 유효한 question list id 인지 확인
        const questionList = await this.questionListRepository.findOne({
            where: { id: questionListId },
        });
        if (!questionList) throw new Error("Question list not found.");

        // 스크랩하려는 질문지가 내가 만든 질문지인지 확인
        const myQuestionLists = await this.questionListRepository
            .getQuestionListsByUserId(userId)
            .getMany();
        const isMyQuestionList = myQuestionLists.some((list) => list.id === questionListId);
        if (isMyQuestionList) throw new Error("Can't scrap my question list.");

        // 스크랩하려는 질문지가 이미 스크랩한 질문지인지 확인
        const alreadyScrappedQuestionLists = await this.questionListRepository
            .getScrappedQuestionListsByUser(user)
            .getMany();
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

    async paginate(query: PaginateQueryDto, queryBuilder: SelectQueryBuilder<any>) {
        const { page, limit, sortBy } = query;

        const skip = (page - 1) * limit;
        const take = limit;
        const [field, direction] = sortBy.split(":");
        const safeDirection: "ASC" | "DESC" =
            direction.toUpperCase() === "ASC" || direction.toUpperCase() === "DESC"
                ? (direction.toUpperCase() as "ASC" | "DESC")
                : "DESC";

        const paginateDto: PaginateDto = {
            queryBuilder,
            skip,
            take,
            field,
            direction: safeDirection,
        };

        const [result, totalItems] = await this.questionListRepository.paginate(paginateDto);
        const totalPages = Math.ceil(totalItems / limit);

        const meta: PaginateMetaDto = {
            itemsPerPage: limit,
            totalItems,
            currentPage: String(page),
            totalPages,
            sortBy: sortBy,
        };

        return {
            data: result,
            meta: meta,
        };
    }
}
