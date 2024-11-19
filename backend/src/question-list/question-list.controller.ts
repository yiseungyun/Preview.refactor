import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { QuestionListService } from "./question-list.service";
import { UserRepository } from "../user/user.repository";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";

@Controller("question-list")
export class QuestionListController {
    constructor(
        private readonly questionService: QuestionListService,
        private readonly userRepository: UserRepository
    ) {}
    @Post()
    @UseGuards(AuthGuard("github"))
    async createQuestionList(
        @Req() req,
        @Body() body: { title: string; contents: string[]; isPublic: boolean }
    ) {
        const { title, contents, isPublic } = body;
        const user = await this.userRepository.getUserByGithubId(req.user.id);

        const createQuestionListDto = new CreateQuestionListDto();
        createQuestionListDto.title = title;
        createQuestionListDto.isPublic = isPublic;
        createQuestionListDto.userId = user.id;

        const createdQuestionList =
            await this.questionService.createQuestionList(
                createQuestionListDto
            );

        const createQuestionDto = new CreateQuestionDto();
        createQuestionDto.contents = contents;
        createQuestionDto.questionListId = createdQuestionList.id;

        await this.questionService.createQuestions(createQuestionDto);

        return createdQuestionList;
    }
}
