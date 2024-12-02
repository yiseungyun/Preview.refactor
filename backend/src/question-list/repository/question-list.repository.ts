import { Injectable } from "@nestjs/common";
import { DataSource, SelectQueryBuilder } from "typeorm";
import { QuestionList } from "../entity/question-list.entity";
import { User } from "@/user/user.entity";
import { UpdateQuestionListDto } from "@/question-list/dto/update-question-list.dto";
import { PaginateDto } from "@/question-list/dto/paginate.dto";

@Injectable()
export class QuestionListRepository {
    constructor(private dataSource: DataSource) {}

    createQuestionList(questionList: QuestionList) {
        return this.dataSource.getRepository(QuestionList).save(questionList);
    }

    findPublicQuestionLists(categoryId?: number) {
        const query = this.dataSource
            .getRepository(QuestionList)
            .createQueryBuilder("question_list")
            .where("question_list.is_public = :isPublic", { isPublic: true });

        if (categoryId !== null) {
            query
                .innerJoin("question_list.categories", "category")
                .andWhere("category.id = :categoryId", { categoryId });
        }

        return query;
    }

    getQuestionListById(questionListId: number) {
        return this.dataSource.getRepository(QuestionList).findOne({
            where: { id: questionListId },
        });
    }

    getQuestionListsByUserId(userId: number) {
        return this.dataSource
            .getRepository(QuestionList)
            .createQueryBuilder("question_list")
            .where("question_list.userId = :userId", { userId });
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
        return this.dataSource
            .getRepository(QuestionList)
            .createQueryBuilder("question_list")
            .innerJoin("question_list.scrappedByUsers", "user")
            .where("user.id = :userId", { userId: user.id });
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

    async paginate(paginateDto: PaginateDto) {
        const { queryBuilder, skip, take, field, direction } = paginateDto;
        return await queryBuilder
            .addOrderBy(`question_list.${field}`, direction)
            .skip(skip)
            .take(take)
            .getManyAndCount();
    }
}
