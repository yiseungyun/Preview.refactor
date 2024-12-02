import { Module } from "@nestjs/common";
import { QuestionRepository } from "@/question-list/repository/question.respository";

@Module({
    providers: [QuestionRepository],
    exports: [QuestionRepository],
})
export class QuestionModule {}
