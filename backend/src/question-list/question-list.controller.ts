import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
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
import { PaginateQueryDto } from "@/question-list/dto/paginate-query.dto";

@Controller("question-list")
export class QuestionListController {
    constructor(private readonly questionListService: QuestionListService) {}

    @Get()
    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllQuestionLists(
        @Res() res,
        @Query() query: PaginateQueryDto,
        @JwtPayload() token: IJwtPayload
    ) {
        try {
            const userId = token ? token.userId : null;
            const { allQuestionLists, meta } = await this.questionListService.getAllQuestionLists(
                query,
                userId
            );
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "All question lists received successfully.",
                data: {
                    allQuestionLists,
                    meta,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get all question lists.",
                error: error.message,
            });
        }
    }

    @Post("category")
    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllQuestionListsByCategoryName(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Query() query: PaginateQueryDto,
        @Body()
        body: {
            categoryName: string;
        }
    ) {
        try {
            const userId = token ? token.userId : null;

            const { categoryName } = body;
            query.category = categoryName;

            const { allQuestionLists, meta } = await this.questionListService.getAllQuestionLists(
                query,
                userId
            );
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "All question lists received successfully.",
                data: {
                    allQuestionLists,
                    meta,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
        @Res() res,
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
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

            // 질문지 DTO 준비
            const createQuestionListDto: CreateQuestionListDto = {
                title,
                contents,
                categoryNames,
                isPublic,
                userId,
            };

            // 질문지 생성
            const { createdQuestionList, createdQuestions } =
                await this.questionListService.createQuestionList(createQuestionListDto);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Question list created successfully.",
                data: {
                    createdQuestionList,
                    createdQuestions,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to create question list.",
                error: error.message,
            });
        }
    }

    @Post("contents")
    @UseGuards(AuthGuard("jwt"))
    async getQuestionListContents(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Body()
        body: {
            questionListId: number;
        }
    ) {
        try {
            const userId = token ? token.userId : null;

            const { questionListId } = body;
            const questionListContents: QuestionListContentsDto =
                await this.questionListService.getQuestionListContents(questionListId, userId);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Question list contents received successfully.",
                data: {
                    questionListContents,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get question list contents.",
                error: error.message,
            });
        }
    }

    @Get("my")
    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new ValidationPipe({ transform: true }))
    async getMyQuestionLists(
        @Res() res,
        @Query() query: PaginateQueryDto,
        @JwtPayload() token: IJwtPayload
    ) {
        try {
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

            const { myQuestionLists, meta } = await this.questionListService.getMyQuestionLists(
                userId,
                query
            );
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "My question lists received successfully.",
                data: {
                    myQuestionLists,
                    meta,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get my question lists.",
                error: error.message,
            });
        }
    }

    @Patch("/:questionListId")
    @UseGuards(AuthGuard("jwt"))
    async updateQuestionList(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Param("questionListId") questionListId: number,
        @Body() body: { title?: string; isPublic?: boolean; categoryNames?: string[] }
    ) {
        try {
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

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
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Question list is updated successfully.",
                data: {
                    questionList: updatedQuestionList,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to update question list.",
                error: error.message,
            });
        }
    }

    @Delete("/:questionListId")
    @UseGuards(AuthGuard("jwt"))
    async deleteQuestionList(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Param("questionListId") questionListId: number
    ) {
        try {
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

            const result = await this.questionListService.deleteQuestionList(
                questionListId,
                userId
            );

            if (result.affected) {
                return res.status(HttpStatus.OK).json({
                    success: true,
                    message: "Question list is deleted successfully.",
                });
            } else {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to delete question list.",
                });
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: true,
                message: "Failed to delete question list.",
                error: error.message,
            });
        }
    }

    @Post("/:questionListId/question")
    @UseGuards(AuthGuard("jwt"))
    async addQuestion(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Body() body: { content: string },
        @Param("questionListId") questionListId: number
    ) {
        try {
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

            const { content } = body;
            const questionDto: QuestionDto = {
                content,
                questionListId,
                userId,
            };

            const result = await this.questionListService.addQuestion(questionDto);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "The new question is added to the list successfully.",
                data: {
                    questionList: result,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to add the new question to the list.",
                error: error.message,
            });
        }
    }

    @Patch("/:questionListId/question/:questionId")
    @UseGuards(AuthGuard("jwt"))
    async updateQuestion(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Body() body: { content: string },
        @Param() params: { questionListId: number; questionId: number }
    ) {
        try {
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

            const { content } = body;
            const { questionListId, questionId } = params;
            const questionDto: QuestionDto = {
                id: questionId,
                content,
                questionListId,
                userId,
            };

            const result = await this.questionListService.updateQuestion(questionDto);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Question is updated successfully.",
                data: {
                    questionList: result,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to update question.",
                error: error.message,
            });
        }
    }

    @Delete("/:questionListId/question/:questionId")
    @UseGuards(AuthGuard("jwt"))
    async deleteQuestion(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Param() params: { questionListId: number; questionId: number }
    ) {
        try {
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

            const { questionListId, questionId } = params;
            const deleteQuestionDto: DeleteQuestionDto = {
                id: questionId,
                questionListId,
                userId,
            };
            const result = await this.questionListService.deleteQuestion(deleteQuestionDto);
            if (result.affected) {
                return res.status(HttpStatus.OK).json({
                    success: true,
                    message: "Question is deleted successfully.",
                });
            } else {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to delete question.",
                });
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete question.",
                error: error.message,
            });
        }
    }

    @Get("scrap")
    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new ValidationPipe({ transform: true }))
    async getScrappedQuestionLists(
        @Res() res,
        @Query() query: PaginateQueryDto,
        @JwtPayload() token: IJwtPayload
    ) {
        try {
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

            const { scrappedQuestionLists, meta } =
                await this.questionListService.getScrappedQuestionLists(userId, query);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Scrapped question lists received successfully.",
                data: {
                    questionList: scrappedQuestionLists,
                    meta,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login required.",
                });

            const { questionListId } = body;
            const scrappedQuestionList = await this.questionListService.scrapQuestionList(
                questionListId,
                userId
            );

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Question list is scrapped successfully.",
                data: {
                    questionList: scrappedQuestionList,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to scrap question list.",
                error: error.message,
            });
        }
    }

    @Delete("scrap/:questionListId")
    @UseGuards(AuthGuard("jwt"))
    async unscrapQuestionList(
        @Res() res,
        @JwtPayload() token: IJwtPayload,
        @Param("questionListId") questionListId: number
    ) {
        try {
            const userId = token ? token.userId : null;

            if (!userId)
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Login is required to create question list.",
                });

            const unscrappedQuestionList = await this.questionListService.unscrapQuestionList(
                questionListId,
                userId
            );

            if (unscrappedQuestionList.affected) {
                return res.status(HttpStatus.OK).json({
                    success: true,
                    message: "Question list unscrapped successfully.",
                });
            } else {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to unscrap question list.",
                });
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to unscrap question list.",
                error: error.message,
            });
        }
    }
}
