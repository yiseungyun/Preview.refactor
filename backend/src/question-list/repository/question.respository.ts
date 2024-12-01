import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Question } from "@/question-list/entity/question.entity";

@Injectable()
export class QuestionRepository {
    constructor(private dataSource: DataSource) {}

    getQuestionById(questionId: number) {
        return this.dataSource.getRepository(Question).findOne({
            where: { id: questionId },
        });
    }

    getContentsByQuestionListId(questionListId: number) {
        return this.dataSource
            .getRepository(Question)
            .createQueryBuilder("question")
            .where("question.question_list_id = :questionListId", { questionListId })
            .getMany();
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

    getQuestionsAfterIndex(questionListId: number, index: number) {
        return this.dataSource
            .getRepository(Question)
            .createQueryBuilder("question")
            .where("question.questionListId = :questionListId", { questionListId })
            .andWhere("question.index > :index", { index })
            .orderBy("question.index", "ASC")
            .getMany();
    }

    createQuestions(questions: Question[]) {
        return this.dataSource.getRepository(Question).save(questions);
    }

    saveQuestion(question: Question) {
        return this.dataSource.getRepository(Question).save(question);
    }

    deleteQuestion(question: Question) {
        return this.dataSource.getRepository(Question).delete(question);
    }
}
