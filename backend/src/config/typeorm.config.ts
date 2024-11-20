import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { User } from "../user/user.entity"; // 엔티티 경로를 수정하세요.
import "dotenv/config";
import { addTransactionalDataSource } from "typeorm-transactional";
import { QuestionList } from "../question-list/question-list.entity";
import { Question } from "../question-list/question.entity";
import { Category } from "../question-list/category.entity";

export const typeOrmConfig: DataSourceOptions = {
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT) ?? 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [User, QuestionList, Question, Category],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
};

let transactionalDataSource: DataSource | null = null;

export const createDataSource = async (): Promise<DataSource> => {
    if (!transactionalDataSource) {
        transactionalDataSource = addTransactionalDataSource(
            new DataSource(typeOrmConfig)
        );
    }
    return transactionalDataSource;
};
