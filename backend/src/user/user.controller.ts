import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UnauthorizedException,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtPayload } from "@/auth/jwt/jwt.decorator";
import { IJwtPayload } from "@/auth/jwt/jwt.model";
import { UserRepository } from "@/user/user.repository";
import { UpdateUserDto } from "@/user/dto/update-user.dto";
import { UserService } from "@/user/user.service";
import { CreateUserDto } from "@/user/dto/create-user.dto";

@Controller("user")
export class UserController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userService: UserService
    ) {}

    @Post("signup")
    @UsePipes(ValidationPipe)
    async handleSignup(@Body() dto: CreateUserDto) {
        return this.userService.createUserByLocal(dto);
    }

    @Get("my")
    @UseGuards(AuthGuard("jwt"))
    async getMyInfo(@JwtPayload() payload: IJwtPayload) {
        if (!payload) throw new UnauthorizedException();
        return this.userService.getChangeableUserInfo(payload.userId);
    }

    @Get(":userId")
    @UsePipes(ValidationPipe)
    async getUserInfo(@Param("userId") userId: number) {
        return this.userService.getChangeableUserInfo(userId);
    }

    @Patch("my")
    @UseGuards(AuthGuard("jwt"))
    async changeMyInfo(@JwtPayload() payload: IJwtPayload, @Body() dto: UpdateUserDto) {
        if (!payload) throw new UnauthorizedException();
        return this.userService.updateUserInfo(payload.userId, dto);
    }
}
