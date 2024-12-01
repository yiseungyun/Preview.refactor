import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@/user/user.repository";
import "dotenv/config";
import { ChangePassword, UpdateUserDto } from "@/user/dto/update-user.dto";
import { AuthService } from "@/auth/auth.service";
import { Transactional } from "typeorm-transactional";
import { LoginType, User } from "@/user/user.entity";
import { CreateUserDto, CreateUserInternalDto } from "@/user/dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService
    ) {}

    public async getChangeableUserInfo(userId: number) {
        const user = await this.userRepository.getUserByUserId(userId);
        if (!user) throw new NotFoundException("User not found");
        return {
            userId: user.id,
            nickname: user.username,
            avatarUrl: user.avatarUrl,
            loginType: user.loginType,
        };
    }

    @Transactional()
    public async updateUserInfo(userId: number, dto: UpdateUserDto) {
        const user = await this.userRepository.getUserByUserId(userId);
        if (!user) throw new BadRequestException("invalid user!");

        const validPasswordDto =
            dto.password &&
            dto.password.original &&
            dto.password.newPassword &&
            user.loginType === LoginType.LOCAL;

        user.avatarUrl = dto.avatarUrl || user.avatarUrl;
        user.passwordHash = validPasswordDto
            ? await this.changePassword(user, dto.password)
            : user.passwordHash;
        user.username = dto.nickname || user.username;

        await this.userRepository.updateUser(user);
        return dto;
    }

    @Transactional()
    public async createUserByLocal(dto: CreateUserDto) {
        const userDto: CreateUserInternalDto = {
            loginId: dto.id,
            loginType: LoginType.LOCAL,
            username: dto.nickname,
            passwordHash: this.authService.generatePasswordHash(dto.password),
        };

        const idExists = await this.userRepository.exists({
            where: { loginId: dto.id },
        });

        if (idExists)
            return {
                code: `DUPLICATE_ID`,
                message: `아이디가 중복되었습니다.`,
                field: "id",
            };

        const nameExists = await this.userRepository.exists({
            where: { username: dto.nickname },
        });

        if (nameExists)
            return {
                code: `DUPLICATE_NICKNAME`,
                message: `닉네임이 중복되었습니다.`,
                field: "nickname",
            };

        await this.userRepository.createUser(userDto);

        return { status: "success" };
    }

    @Transactional()
    private async changePassword(user: User, pair: ChangePassword) {
        const originalHash = this.authService.generatePasswordHash(pair.original);

        if (originalHash !== user.passwordHash)
            throw new BadRequestException("password does not match!");

        return this.authService.generatePasswordHash(pair.newPassword);
    }
}
