import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomGateway } from "./room.gateway";
import { RedisService } from "../redis/redis.service";
import { RoomRepository } from "./room.repository";

@Module({
    providers: [RoomService, RoomGateway, RedisService, RoomRepository],
})
export class RoomModule {}
