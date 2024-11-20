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
