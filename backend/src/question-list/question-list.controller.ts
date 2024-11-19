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
        try {
            const { title, contents, isPublic } = body;
            const user = await this.userRepository.getUserByGithubId(
                req.user.id
            );

            // 질문지 DTO 준비
            const createQuestionListDto = new CreateQuestionListDto();
            createQuestionListDto.title = title;
            createQuestionListDto.isPublic = isPublic;
            createQuestionListDto.userId = user.id;

            // 질문지 생성
            const createdQuestionList =
                await this.questionService.createQuestionList(
                    createQuestionListDto
                );

            // 질문 DTO 준비
            const createQuestionDto = new CreateQuestionDto();
            createQuestionDto.contents = contents;
            createQuestionDto.questionListId = createdQuestionList.id;

            // 질문 생성
            const createdQuestions =
                await this.questionService.createQuestions(createQuestionDto);

            return {
                success: true,
                message: "Question list created successfully.",
                data: {
                    createdQuestionList,
                    createdQuestions,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to create question list.",
                error: error.message,
            };
        }
    }
}
