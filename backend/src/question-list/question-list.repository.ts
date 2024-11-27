import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { QuestionList } from "./question-list.entity";
import { Question } from "./question.entity";
import { Category } from "./category.entity";
import { User } from "@/user/user.entity";
import { PaginateQuery } from "nestjs-paginate";

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
        return this.dataSource
            .getRepository(QuestionList)
            .createQueryBuilder("question_list")
            .where("question_list.is_public = :isPublic", { isPublic: true });
    }

    async getCategoryIdByName(categoryName: string) {
        const category = await this.dataSource.getRepository(Category).findOne({
            where: { name: categoryName },
            select: ["id"],
        });

        return category?.id || null;
    }

    findPublicQuestionListsByCategoryId(categoryId: number) {
        return this.dataSource
            .getRepository(QuestionList)
            .createQueryBuilder("question_list")
            .innerJoin("question_list.categories", "category")
            .where("question_list.is_public = :isPublic", { isPublic: true })
            .andWhere("category.id = :categoryId", { categoryId });
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
        return this.dataSource
            .getRepository(Question)
            .createQueryBuilder("question")
            .where("question.question_list_id = :questionListId", { questionListId })
            .getMany();
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
