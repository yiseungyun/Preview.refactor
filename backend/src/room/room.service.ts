import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { Room } from "./room.model";
import { generateRoomId } from "../utils/generateRoomId";
import { HOUR } from "../utils/time";

@Injectable()
export class RoomService {
    constructor(private readonly redisService: RedisService) {}

    async createRoom(title: string, socketId: string) {
        const client = this.redisService.getClient();
        const roomId = generateRoomId();

        await client.hset(`room:${roomId}`, {
            title: title,
            createdAt: Date.now(),
            members: [socketId],
            host: socketId,
        } as Room);

        await client.expire(`room:${roomId}`, 6 * HOUR);
        return roomId;
    }
}
