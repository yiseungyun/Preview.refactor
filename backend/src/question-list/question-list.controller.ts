import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import { QuestionListService } from "./question-list.service";
import { CreateQuestionListDto } from "./dto/create-question-list.dto";
import { QuestionListContentsDto } from "./dto/question-list-contents.dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtPayload } from "@/auth/jwt/jwt.decorator";
import { IJwtPayload } from "@/auth/jwt/jwt.model";
import { UpdateQuestionListDto } from "@/question-list/dto/update-question-list.dto";
import { QuestionDto } from "@/question-list/dto/question.dto";
import { DeleteQuestionDto } from "@/question-list/dto/delete-question.dto";
import { PaginateQuery } from "nestjs-paginate";

@Controller("question-list")
export class QuestionListController {
    constructor(private readonly questionListService: QuestionListService) {}

    @Get()
    async getAllQuestionLists(@Query() query: PaginateQuery) {
        try {
            const { allQuestionLists, meta } =
                await this.questionListService.getAllQuestionLists(query);
            return {
                success: true,
                message: "All question lists received successfully.",
                data: {
                    allQuestionLists,
                    meta,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to get all question lists.",
                error: error.message,
            };
        }
    }

    @Post("category")
    async getAllQuestionListsByCategoryName(
        @Query() query: PaginateQuery,
        @Body()
        body: {
            categoryName: string;
        }
    ) {
        try {
            const { categoryName } = body;
            const { allQuestionLists, meta } = await this.questionListService.getAllQuestionLists(
                query,
                categoryName
            );
            return {
                success: true,
                message: "All question lists received successfully.",
                data: {
                    allQuestionLists,
                    meta,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to get all question lists.",
                error: error.message,
            };
        }
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createQuestionList(
        @JwtPayload() token: IJwtPayload,
        @Req() req,
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

    @Post("contents")
    async getQuestionListContents(
        @Body()
        body: {
            questionListId: number;
        }
    ) {
        try {
            const { questionListId } = body;
            const questionListContents: QuestionListContentsDto =
                await this.questionListService.getQuestionListContents(questionListId);
            return {
                success: true,
                message: "Question list contents received successfully.",
                data: {
                    questionListContents,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to get question list contents.",
                error: error.message,
            };
        }
    }

    @Get("my")
    @UseGuards(AuthGuard("jwt"))
    async getMyQuestionLists(@Query() query: PaginateQuery, @JwtPayload() token: IJwtPayload) {
        try {
            const userId = token.userId;
            const { myQuestionLists, meta } = await this.questionListService.getMyQuestionLists(
                userId,
                query
            );
            return {
                success: true,
                message: "My question lists received successfully.",
                data: {
                    myQuestionLists,
                    meta,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to get my question lists.",
                error: error.message,
            };
        }
    }

    @Patch("/:questionListId")
    @UseGuards(AuthGuard("jwt"))
    async updateQuestionList(
        @JwtPayload() token: IJwtPayload,
        @Param("questionListId") questionListId: number,
        @Body() body: { title?: string; isPublic?: boolean; categoryNames?: string[] }
    ) {
        try {
            const userId = token.userId;
            const { title, isPublic, categoryNames } = body;
            const updateQuestionListDto: UpdateQuestionListDto = {
                id: questionListId,
                title,
                isPublic,
                categoryNames,
                userId,
            };

            const updatedQuestionList =
                await this.questionListService.updateQuestionList(updateQuestionListDto);
            return {
                success: true,
                message: "Question list is updated successfully.",
                data: {
                    questionList: updatedQuestionList,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to update question list.",
                error: error.message,
            };
        }
    }

    @Delete("/:questionListId")
    @UseGuards(AuthGuard("jwt"))
    async deleteQuestionList(
        @JwtPayload() token: IJwtPayload,
        @Param("questionListId") questionListId: number
    ) {
        try {
            const userId = token.userId;
            const result = await this.questionListService.deleteQuestionList(
                questionListId,
                userId
            );

            if (result.affected) {
                return {
                    success: true,
                    message: "Question list is deleted successfully.",
                };
            } else {
                return {
                    success: true,
                    message: "Failed to delete question list.",
                };
            }
        } catch (error) {
            return {
                success: true,
                message: "Failed to delete question list.",
                error: error.message,
            };
        }
    }

    @Post("/:questionListId/question")
    @UseGuards(AuthGuard("jwt"))
    async addQuestion(
        @JwtPayload() token: IJwtPayload,
        @Body() body: { content: string },
        @Param("questionListId") questionListId: number
    ) {
        try {
            const userId = token.userId;
            const { content } = body;
            const questionDto: QuestionDto = {
                content,
                questionListId,
                userId,
            };

            const result = await this.questionListService.addQuestion(questionDto);

            return {
                success: true,
                message: "The new question is added to the list successfully.",
                data: {
                    questionList: result,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to add the new question to the list.",
                error: error.message,
            };
        }
    }

    @Patch("/:questionListId/question/:questionId")
    @UseGuards(AuthGuard("jwt"))
    async updateQuestion(
        @JwtPayload() token: IJwtPayload,
        @Body() body: { content: string },
        @Param() params: { questionListId: number; questionId: number }
    ) {
        try {
            const userId = token.userId;
            const { content } = body;
            const { questionListId, questionId } = params;
            const questionDto: QuestionDto = {
                id: questionId,
                content,
                questionListId,
                userId,
            };

            const result = await this.questionListService.updateQuestion(questionDto);

            return {
                success: true,
                message: "Question is updated successfully.",
                data: {
                    questionList: result,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to update question.",
                error: error.message,
            };
        }
    }

    @Delete("/:questionListId/question/:questionId")
    @UseGuards(AuthGuard("jwt"))
    async deleteQuestion(
        @JwtPayload() token: IJwtPayload,
        @Param() params: { questionListId: number; questionId: number }
    ) {
        try {
            const userId = token.userId;
            const { questionListId, questionId } = params;
            const deleteQuestionDto: DeleteQuestionDto = {
                id: questionId,
                questionListId,
                userId,
            };
            const result = await this.questionListService.deleteQuestion(deleteQuestionDto);
            if (result.affected) {
                return {
                    success: true,
                    message: "Question is deleted successfully.",
                };
            } else {
                return {
                    success: true,
                    message: "Failed to delete question.",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: "Failed to delete question.",
                error: error.message,
            };
        }
    }

    @Get("scrap")
    @UseGuards(AuthGuard("jwt"))
    async getScrappedQuestionLists(
        @Query() query: PaginateQuery,
        @JwtPayload() token: IJwtPayload
    ) {
        try {
            const userId = token.userId;
            const { scrappedQuestionLists, meta } =
                await this.questionListService.getScrappedQuestionLists(userId, query);
            return {
                success: true,
                message: "Scrapped question lists received successfully.",
                data: {
                    questionList: scrappedQuestionLists,
                    meta,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to get scrapped question lists.",
                error: error.message,
            };
        }
    }

    @Post("scrap")
    @UseGuards(AuthGuard("jwt"))
    async scrapQuestionList(
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

            return {
                success: true,
                message: "Question list is scrapped successfully.",
                data: {
                    questionList: scrappedQuestionList,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to scrap question list.",
                error: error.message,
            };
        }
    }

    @Delete("scrap/:questionListId")
    @UseGuards(AuthGuard("jwt"))
    async unscrapQuestionList(
        @JwtPayload() token: IJwtPayload,
        @Param("questionListId") questionListId: number
    ) {
        try {
            const userId = token.userId;
            const unscrappedQuestionList = await this.questionListService.unscrapQuestionList(
                questionListId,
                userId
            );

            if (unscrappedQuestionList.affected) {
                return {
                    success: true,
                    message: "Question list unscrapped successfully.",
                };
            } else {
                return {
                    success: false,
                    message: "Failed to unscrap question list.",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: "Failed to unscrap question list.",
                error: error.message,
            };
        }
    }
}
