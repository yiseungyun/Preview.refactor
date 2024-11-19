import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { SocketModule } from "./signaling-server/socket.module";
import { RoomModule } from "./room/room.module";
import { RedisModule } from "./redis/redis.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { User } from "./user/user.entity";

import "dotenv/config";
import { addTransactionalDataSource } from "typeorm-transactional";
import { DataSource } from "typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory() {
                return {
                    type: "mysql",
                    host: process.env.MYSQL_HOST,
                    port: parseInt(process.env.MYSQL_PORT) ?? 3306,
                    username: process.env.MYSQL_USERNAME,
                    password: process.env.MYSQL_PASSWORD,
                    database: process.env.MYSQL_DATABASE,
                    entities: [User],
                    namingStrategy: new SnakeNamingStrategy(),
                    synchronize: true,
                };
            },
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error("Invalid options passed");
                }
                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        SocketModule,
        RoomModule,
        RedisModule,
        AuthModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
