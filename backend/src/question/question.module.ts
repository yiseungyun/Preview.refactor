import { Module } from "@nestjs/common";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { QuestionRepository } from "./question.repository";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    controllers: [QuestionController],
    providers: [QuestionService, QuestionRepository],
})
export class QuestionModule {}
