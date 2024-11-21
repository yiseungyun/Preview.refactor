import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { QuestionList } from "./question-list.entity";
import { Question } from "./question.entity";
import { QuestionDto } from "./dto/question.dto";
import { Category } from "./category.entity";
import { QuestionListDto } from "./dto/question-list.dto";
import { User } from "../user/user.entity";

@Injectable()
export class QuestionListRepository {
    constructor(private dataSource: DataSource) {}

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
        const questionList = await this.dataSource
            .getRepository(QuestionList)
            .findOne({
                where: { id: questionListId },
                relations: ["categories"], // 질문지와 관련된 카테고리도 함께 조회
            });
        console.log(questionList);
        return questionList
            ? questionList.categories.map((category) => category.name)
            : [];
    }

    createQuestionList(questionListDto: QuestionListDto) {
        return this.dataSource
            .getRepository(QuestionList)
            .save(questionListDto);
    }

    async createQuestions(questionDtos: QuestionDto[]) {
        try {
            const result = await this.dataSource.getRepository(Question).save(questionDtos);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
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
}
