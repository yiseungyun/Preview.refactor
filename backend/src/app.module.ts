import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { RoomModule } from "./room/room.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";

import "dotenv/config";

import { createDataSource, typeOrmConfig } from "./infra/typeorm/typeorm.config";
import { QuestionListModule } from "./question-list/question-list.module";
import { RedisOmModule } from "@moozeh/nestjs-redis-om";
import { SigServerModule } from "@/signaling-server/sig-server.module";
import { redisConfig } from "@/infra/infra.config";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => typeOrmConfig, // 설정 객체를 직접 반환
            dataSourceFactory: async () => await createDataSource(), // 분리된 데이터소스 생성 함수 사용
        }),
        RedisOmModule.forRoot({
            url: `redis://${redisConfig.host}:${redisConfig.port}`,
        }),
        RoomModule,
        AuthModule,
        UserModule,
        QuestionListModule,
        SigServerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
