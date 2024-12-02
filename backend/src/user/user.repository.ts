import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { DataSource, Repository } from "typeorm";
import { CreateUserInternalDto } from "./dto/create-user.dto";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    getUserByGithubId(githubId: number) {
        return this.createQueryBuilder("user")
            .where("user.github_id = :id", { id: githubId })
            .getOne();
    }

    getUserByUserId(userId: number) {
        return this.createQueryBuilder("user").where("user.id = :id", { id: userId }).getOne();
    }

    // TODO: 로그인 ID로 인덱싱 생성 필요?
    getUserByLoginId(username: string) {
        return this.createQueryBuilder("user")
            .where("user.login_id = :id", { id: username })
            .getOne();
    }

    createUser(createUserDto: CreateUserInternalDto) {
        return this.save(createUserDto);
    }

    updateUser(userDto: UserDto) {
        return this.save(userDto);
    }
}
