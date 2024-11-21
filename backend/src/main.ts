import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
    initializeTransactionalContext,
    StorageDriver,
} from "typeorm-transactional";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    initializeTransactionalContext({
        storageDriver: StorageDriver.AUTO, // 명시적으로 storage driver 설정
    });

    const app = await NestFactory.create(AppModule);

    app.enableCors({
        credentials: true,
    });

    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
