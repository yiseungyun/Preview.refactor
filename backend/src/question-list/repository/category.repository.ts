import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Category } from "@/question-list/entity/category.entity";

@Injectable()
export class CategoryRepository extends Repository<Category> {
    constructor(private dataSource: DataSource) {
        super(Category, dataSource.createEntityManager());
    }

    async findCategoryNamesByQuestionListId(questionListId: number) {
        const categories = await this.createQueryBuilder("category")
            .innerJoin("category.questionLists", "questionList")
            .where("questionList.id = :questionListId", { questionListId })
            .select("category.name")
            .getMany();

        return categories.map((category) => category.name);
    }
}
