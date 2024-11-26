import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { QuestionListService } from "./question-list.service";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { GetAllQuestionListDto } from "./dto/get-all-question-list.dto";
import { QuestionListContentsDto } from "./dto/question-list-contents.dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtPayload } from "@/auth/jwt/jwt.decorator";
import { IJwtPayload } from "@/auth/jwt/jwt.model";
import { MyQuestionListDto } from "./dto/my-question-list.dto";

@Controller("question-list")
export class QuestionListController {
    constructor(private readonly questionListService: QuestionListService) {}

    @Get()
    async getAllQuestionLists(@Res() res) {
        try {
            const allQuestionLists: GetAllQuestionListDto[] =
                await this.questionListService.getAllQuestionLists();
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
        @JwtPayload() token: IJwtPayload,
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
                contents,
                categoryNames,
                isPublic,
                userId: token.userId,
            };

            // 질문지 생성
            const { createdQuestionList, createdQuestions } =
                await this.questionListService.createQuestionList(createQuestionListDto);

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
                await this.questionListService.getAllQuestionListsByCategoryName(categoryName);
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

    @Post("contents")
    async getQuestionListContents(
        @Res() res,
        @Body()
        body: {
            questionListId: number;
        }
    ) {
        try {
            const { questionListId } = body;
            const questionListContents: QuestionListContentsDto =
                await this.questionListService.getQuestionListContents(questionListId);
            return res.send({
                success: true,
                message: "Question list contents received successfully.",
                data: {
                    questionListContents,
                },
            });
        } catch (error) {
            return res.send({
                success: false,
                message: "Failed to get question list contents.",
                error: error.message,
            });
        }
    }

    @Get("my")
    @UseGuards(AuthGuard("jwt"))
    async getMyQuestionLists(@Res() res, @JwtPayload() token: IJwtPayload) {
        try {
            const userId = token.userId;
            const myQuestionLists: MyQuestionListDto[] =
                await this.questionListService.getMyQuestionLists(userId);
            return res.send({
                success: true,
                message: "My question lists received successfully.",
                data: {
                    myQuestionLists,
                },
            });
        } catch (error) {
            return res.send({
                success: false,
                message: "Failed to get my question lists.",
                error: error.message,
            });
        }
    }

    @Get("scrap")
    @UseGuards(AuthGuard("jwt"))
    async getScrappedQuestionLists(@Res() res, @JwtPayload() token: IJwtPayload) {
        try {
            const userId = token.userId;
            const scrappedQuestionLists =
                await this.questionListService.getScrappedQuestionLists(userId);
            return res.send({
                success: true,
                message: "Scrapped question lists received successfully.",
                data: {
                    scrappedQuestionLists,
                },
            });
        } catch (error) {
            return res.send({
                success: false,
                message: "Failed to get scrapped question lists.",
                error: error.message,
            });
        }
    }

    @Post("scrap")
    @UseGuards(AuthGuard("jwt"))
    async scrapQuestionList(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Body() body: { questionListId: number }
    ) {
        try {
            const userId = token.userId;
            const { questionListId } = body;
            const scrappedQuestionList = await this.questionListService.scrapQuestionList(
                questionListId,
                userId
            );

            return res.send({
                success: true,
                message: "Question list is scrapped successfully.",
                data: {
                    scrappedQuestionList,
                },
            });
        } catch (error) {
            return res.send({
                success: false,
                message: "Failed to scrap question list.",
                error: error.message,
            });
        }
    }
}
