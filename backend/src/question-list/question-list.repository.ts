import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { QuestionList } from "./question-list.entity";
import { Question } from "./question.entity";

@Injectable()
export class QuestionListRepository {
    constructor(private dataSource: DataSource) {}

    createQuestionList(createQuestionListDto: CreateQuestionListDto) {
        return this.dataSource
            .getRepository(QuestionList)
            .save(createQuestionListDto);
    }

    async createQuestions(createQuestionDtos: CreateQuestionDto[]) {
        return this.dataSource.getRepository(Question).save(createQuestionDtos);
    }
}
