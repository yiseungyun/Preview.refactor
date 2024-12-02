import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Question } from "@/question-list/entity/question.entity";

@Injectable()
export class QuestionRepository extends Repository<Question> {
    constructor(private dataSource: DataSource) {
        super(Question, dataSource.createEntityManager());
    }

    getContentsByQuestionListId(questionListId: number) {
        return this.createQueryBuilder("question")
            .where("question.question_list_id = :questionListId", { questionListId })
            .getMany();
    }

    getQuestionCountByQuestionListId(questionListId: number) {
        return this.createQueryBuilder("question")
            .where("question.questionListId = :questionListId", { questionListId })
            .getCount();
    }

    getQuestionsAfterIndex(questionListId: number, index: number) {
        return this.createQueryBuilder("question")
            .where("question.questionListId = :questionListId", { questionListId })
            .andWhere("question.index > :index", { index })
            .orderBy("question.index", "ASC")
            .getMany();
    }
}
