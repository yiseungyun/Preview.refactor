import { Module } from "@nestjs/common";
import { QuestionListController } from "./question-list.controller";
import { QuestionListService } from "./question-list.service";
import { QuestionListRepository } from "./repository/question-list.repository";
import { UserRepository } from "@/user/user.repository";
import { QuestionRepository } from "@/question-list/repository/question.respository";
import { CategoryRepository } from "@/question-list/repository/category.repository";

@Module({
    controllers: [QuestionListController],
    providers: [
        QuestionListService,
        QuestionListRepository,
        QuestionRepository,
        UserRepository,
        CategoryRepository,
    ],
    exports: [QuestionListRepository, QuestionRepository],
})
export class QuestionListModule {}
