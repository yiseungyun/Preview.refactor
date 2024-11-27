import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { QuestionList } from "./question-list.entity";
import { Question } from "./question.entity";
import { Category } from "./category.entity";
import { User } from "@/user/user.entity";
import { UpdateQuestionListDto } from "@/question-list/dto/update-question-list.dto";

@Injectable()
export class QuestionListRepository {
    constructor(private dataSource: DataSource) {}

    createQuestionList(questionList: QuestionList) {
        return this.dataSource.getRepository(QuestionList).save(questionList);
    }

    async createQuestions(questions: Question[]) {
        return this.dataSource.getRepository(Question).save(questions);
    }

    findPublicQuestionLists() {
        return this.dataSource.getRepository(QuestionList).find({
            where: { isPublic: true },
        });
    }

    async getCategoryIdByName(categoryName: string) {
        const category = await this.dataSource.getRepository(Category).findOne({
            where: { name: categoryName },
            select: ["id"],
        });

        return category?.id || null;
    }

    findPublicQuestionListsByCategoryId(categoryId: number) {
        return this.dataSource.getRepository(QuestionList).find({
            where: {
                isPublic: true,
                categories: { id: categoryId },
            },
            relations: ["categories"],
        });
    }

    async findCategoryNamesByQuestionListId(questionListId: number) {
        const questionList = await this.dataSource.getRepository(QuestionList).findOne({
            where: { id: questionListId },
            relations: ["categories"], // 질문지와 관련된 카테고리도 함께 조회
        });

        return questionList ? questionList.categories.map((category) => category.name) : [];
    }

    async findCategoriesByNames(categoryNames: string[]) {
        return this.dataSource.getRepository(Category).find({
            where: {
                name: In(categoryNames),
            },
        });
    }

    getQuestionListById(questionListId: number) {
        return this.dataSource.getRepository(QuestionList).findOne({
            where: { id: questionListId },
        });
    }

    getContentsByQuestionListId(questionListId: number) {
        return this.dataSource.getRepository(Question).find({
            where: { questionListId },
        });
    }

    async getUsernameById(userId: number) {
        const user = await this.dataSource.getRepository(User).findOne({
            where: { id: userId },
        });

        return user?.username || null;
    }

    getQuestionListsByUserId(userId: number) {
        return this.dataSource.getRepository(QuestionList).find({
            where: { userId },
        });
    }

    getQuestionCountByQuestionListId(questionListId: number) {
        return this.dataSource
            .getRepository(Question)
            .createQueryBuilder("question")
            .where("question.questionListId = :questionListId", {
                questionListId,
            })
            .getCount();
    }

    updateQuestionList(updateQuestionListDto: UpdateQuestionListDto) {
        return this.dataSource.getRepository(QuestionList).save(updateQuestionListDto);
    }

    deleteQuestionList(questionListId: number) {
        return this.dataSource.getRepository(QuestionList).delete(questionListId);
    }

    scrapQuestionList(questionListId: number, userId: number) {
        return this.dataSource
            .createQueryBuilder()
            .insert()
            .into("user_question_list")
            .values({
                user_id: userId,
                question_list_id: questionListId,
            })
            .orIgnore()
            .execute();
    }

    getScrappedQuestionListsByUser(user: User) {
        return this.dataSource.getRepository(QuestionList).find({
            where: { scrappedByUsers: user },
        });
    }

    unscrapQuestionList(questionListId: number, userId: number) {
        return this.dataSource
            .createQueryBuilder()
            .delete()
            .from("user_question_list")
            .where("user_id = :userId", { userId })
            .andWhere("question_list_id = :questionListId", { questionListId })
            .execute();
    }
}
