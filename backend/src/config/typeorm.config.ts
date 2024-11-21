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

        await transactionalDataSource.initialize();
        await seedDatabase(transactionalDataSource);
    }
    return transactionalDataSource;
};

const seedDatabase = async (dataSource: DataSource) => {
    const categoryRepository = dataSource.getRepository(Category);

    const categories = [
        "자료구조",
        "운영체제",
        "데이터베이스",
        "컴퓨터구조",
        "네트워크",
        "백엔드",
        "프론트엔드",
        "알고리즘",
        "보안",
    ];

    // 이미 데이터가 있을 경우 시딩하지 않음
    const existingCount = await categoryRepository.count();
    if (existingCount > 0) {
        return;
    }

    // 카테고리 데이터 삽입
    const categoryEntities = categories.map((name) => {
        const category = new Category();
        category.name = name;
        return category;
    });

    await categoryRepository.save(categoryEntities);
};