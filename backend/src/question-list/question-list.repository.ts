import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { QuestionList } from "./question-list.entity";
import { Question } from "./question.entity";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { QuestionDto } from "./dto/question.dto";

@Injectable()
export class QuestionListRepository {
    constructor(private dataSource: DataSource) {}

    createQuestionList(createQuestionListDto: CreateQuestionListDto) {
        return this.dataSource
            .getRepository(QuestionList)
            .save(createQuestionListDto);
    }

    async createQuestions(questionDtos: QuestionDto[]) {
        return this.dataSource.getRepository(Question).save(questionDtos);
    }
}
