import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
    initializeTransactionalContext,
    StorageDriver,
} from "typeorm-transactional";

async function bootstrap() {
    initializeTransactionalContext({
        storageDriver: StorageDriver.AUTO, // 명시적으로 storage driver 설정
    });
    
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
