import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { QuestionListService } from "./question-list.service";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { JwtAuthenticationGuard } from "../auth/jwt.guard";

@Controller("question-list")
export class QuestionListController {
    constructor(private readonly questionService: QuestionListService) {}
    @Post()
    // @UseGuards(JwtAuthenticationGuard)
    async createQuestionList(
        @Req() req,
        @Res() res,
        @Body()
        body: {
            title: string;
            contents: string[];
            categoryNames: string[];
            isPublic: boolean;
        }
    ) {
        try {
            const { title, contents, categoryNames, isPublic } = body;

            // 질문지 DTO 준비
            const createQuestionListDto: CreateQuestionListDto = {
                title,
                categoryNames,
                isPublic,
                // userId: req.user.id,
                userId: 1,
            };

            // 질문지 생성
            const createdQuestionList =
                await this.questionService.createQuestionList(
                    createQuestionListDto
                );

            // 질문 DTO 준비
            const createQuestionDto: CreateQuestionDto = {
                contents,
                questionListId: createdQuestionList.id,
            };

            // 질문 생성
            const createdQuestions =
                await this.questionService.createQuestions(createQuestionDto);

            return res.send({
                success: true,
                message: "Question list created successfully.",
                data: {
                    createdQuestionList,
                    createdQuestions,
                },
            });
        } catch (error) {
            return res.send({
                success: false,
                message: "Failed to create question list.",
                error: error.message,
            });
        }
    }
}
