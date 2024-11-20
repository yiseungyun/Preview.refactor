import { Module } from "@nestjs/common";
import { QuestionListController } from "./question-list.controller";
import { QuestionListService } from "./question-list.service";
import { QuestionListRepository } from "./question-list.repository";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    controllers: [QuestionListController],
    providers: [QuestionListService, QuestionListRepository],
})
export class QuestionListModule {}
