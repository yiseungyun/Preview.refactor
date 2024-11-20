import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { QuestionListService } from "./question-list.service";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { GetAllQuestionListDto } from "./dto/get-all-question-list.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("question-list")
export class QuestionListController {
    constructor(private readonly questionService: QuestionListService) {}

    @Get()
    async getAllQuestionLists(@Res() res) {
        try {
            const allQuestionLists: GetAllQuestionListDto[] =
                await this.questionService.getAllQuestionLists();
            return res.send({
                success: true,
                message: "All question lists received successfully.",
                data: {
                    allQuestionLists,
                },
            });
        } catch (error) {
            return res.send({
                success: false,
                message: "Failed to get all question lists.",
                error: error.message,
            });
        }
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
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
                userId: req.user.userId,
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

    @Post("category")
    async getAllQuestionListsByCategoryName(
        @Res() res,
        @Body()
        body: {
            categoryName: string;
        }
    ) {
        try {
            const { categoryName } = body;
            const allQuestionLists: GetAllQuestionListDto[] =
                await this.questionService.getAllQuestionListsByCategoryName(
                    categoryName
                );
            return res.send({
                success: true,
                message: "All question lists received successfully.",
                data: {
                    allQuestionLists,
                },
            });
        } catch (error) {
            return res.send({
                success: false,
                message: "Failed to get all question lists.",
                error: error.message,
            });
        }
    }
}
