import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { QuestionList } from "./question-list.entity";
import { Question } from "./question.entity";
import { QuestionDto } from "./dto/question.dto";
import { Category } from "./category.entity";
import { QuestionListDto } from "./dto/question-list.dto";

@Injectable()
export class QuestionListRepository {
    constructor(private dataSource: DataSource) {}

    findPublicQuestionLists() {
        return this.dataSource.getRepository(QuestionList).find({
            where: { isPublic: true },
        });
    }

    async findCategoryNamesByQuestionListId(questionListId) {
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
        return this.dataSource.getRepository(Question).save(questionDtos);
    }

    async findCategoriesByNames(categoryNames: string[]) {
        return this.dataSource.getRepository(Category).find({
            where: {
                name: In(categoryNames),
            },
        });
    }
}
