import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { QuestionService } from "./question.service";
import { UserRepository } from "../user/user.repository";

@Controller("question-list")
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
        private readonly userRepository: UserRepository
    ) {}
    @Post()
    @UseGuards(AuthGuard("github"))
    async createQuestionList(
        @Req() req,
        @Body() body: { title: string; questions: string[]; isPublic: boolean }
    ) {
        const { title, questions, isPublic } = body;
        const user = await this.userRepository.getUserByGithubId(req.user.id);

        const createdQuestionList =
            await this.questionService.createQuestionList(
                title,
                isPublic,
                user.id
            );
        await this.questionService.createQuestions(
            createdQuestionList.id,
            questions
        );

        return createdQuestionList;
    }
}
