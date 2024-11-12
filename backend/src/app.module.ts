import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SocketModule } from "./signaling-server/socket.module";
import { RoomModule } from "./room/room.module";
import { RedisModule } from "./redis/redis.module";

import "dotenv/config";

@Module({
    imports: [SocketModule, RoomModule, RedisModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
