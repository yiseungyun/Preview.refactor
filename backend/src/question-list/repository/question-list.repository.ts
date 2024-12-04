import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { QuestionList } from "../entity/question-list.entity";
import { User } from "@/user/user.entity";
import { PaginateDto } from "@/question-list/dto/paginate.dto";

@Injectable()
export class QuestionListRepository extends Repository<QuestionList> {
    constructor(private dataSource: DataSource) {
        super(QuestionList, dataSource.createEntityManager());
    }

    findPublicQuestionLists(categoryId?: number) {
        const query = this.createQueryBuilder("question_list").where(
            "question_list.is_public = :isPublic",
            { isPublic: true }
        );

        if (categoryId !== null) {
            query
                .innerJoin("question_list.categories", "category")
                .andWhere("category.id = :categoryId", { categoryId });
        }

        return query;
    }

    getQuestionListsByUserId(userId: number) {
        return this.createQueryBuilder("question_list").where("question_list.userId = :userId", {
            userId,
        });
    }

    scrapQuestionList(questionListId: number, userId: number) {
        return this.createQueryBuilder()
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
        return this.createQueryBuilder("question_list")
            .innerJoin("question_list.scrappedByUsers", "user")
            .where("user.id = :userId", { userId: user.id });
    }

    unscrapQuestionList(questionListId: number, userId: number) {
        return this.createQueryBuilder()
            .delete()
            .from("user_question_list")
            .where("user_id = :userId", { userId })
            .andWhere("question_list_id = :questionListId", { questionListId })
            .execute();
    }

    isQuestionListScrapped(questionListId: number, userId: number) {
        return this.createQueryBuilder("question_list")
            .innerJoin("question_list.scrappedByUsers", "user")
            .where("question_list.id = :questionListId", { questionListId })
            .andWhere("user.id = :userId", { userId })
            .select("1")
            .getRawOne()
            .then((result) => !!result);
    }

    getScrapCount(questionListId: number) {
        return this.createQueryBuilder("question_list")
            .innerJoin("question_list.scrappedByUsers", "user")
            .where("question_list.id = :questionListId", { questionListId })
            .select("COUNT(user.id)", "count")
            .getRawOne();
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
