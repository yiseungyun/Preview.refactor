import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { Category } from "@/question-list/entity/category.entity";

@Injectable()
export class CategoryRepository {
    constructor(private dataSource: DataSource) {}

    async getCategoryIdByName(categoryName: string) {
        const category = await this.dataSource.getRepository(Category).findOne({
            where: { name: categoryName },
            select: ["id"],
        });

        return category?.id || null;
    }

    findCategoriesByNames(categoryNames: string[]) {
        return this.dataSource.getRepository(Category).find({
            where: {
                name: In(categoryNames),
            },
        });
    }

    async findCategoryNamesByQuestionListId(questionListId: number) {
        const categories = await this.dataSource
            .getRepository(Category)
            .createQueryBuilder("category")
            .innerJoin("category.questionLists", "questionList")
            .where("questionList.id = :questionListId", { questionListId })
            .select("category.name")
            .getMany();

        return categories.map((category) => category.name);
    }
}
