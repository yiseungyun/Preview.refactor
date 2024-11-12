import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomGateway } from "./room.gateway";
import { RedisService } from "../redis/redis.service";

@Module({
    providers: [RoomService, RoomGateway, RedisService],
})
export class RoomModule {}
