import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomGateway } from "./room.gateway";
import { RedisService } from "../redis/redis.service";
import { RoomRepository } from "./room.repository";
import { RoomController } from "./room.controller";
import { QuestionListModule } from "../question-list/question-list.module";

@Module({
    imports: [QuestionListModule],
    providers: [RoomService, RoomGateway, RedisService, RoomRepository],
    controllers: [RoomController],
})
export class RoomModule {}
