import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { DataSource } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserRepository {
    constructor(private dataSource: DataSource) {}

    getUserByGithubId(githubId: number) {
        return this.dataSource
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.github_id = :id", { id: githubId })
            .getOne();
    }

    createUser(createUserDto: CreateUserDto) {
        return this.dataSource.getRepository(User).save(createUserDto);
    }
}
