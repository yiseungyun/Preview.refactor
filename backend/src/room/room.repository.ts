import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { MemberConnection, Room } from "./room.model";
import { generateRoomId } from "../utils/generateRoomId";
import { HOUR } from "../utils/time";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";

/**
 * `room:` 과 같은 태그를 사용하는 부분
 * 실제 더 복잡한 비즈니스 로직을 처리할 수 있도록 함수를 일반화 하려고 합니다.
 */
@Injectable()
export class RoomRepository {
    constructor(private readonly redisService: RedisService) {}

    async getAllRoom(): Promise<Room[]> {
        return (await this.redisService.getMap("room:*")) as Room[];
    }

    async getRoomMemberConnection(roomId: string) {
        console.log("멤버커넥션 : roomId", roomId);
        const connectionMap = await this.redisService.getMap(
            `join:${roomId}:*`
        );

        if (!connectionMap) return [];

        return Object.entries(connectionMap).reduce(
            (acc, [socketId, connection]) => {
                acc[socketId.split(":")[2]] = connection as MemberConnection; // 현재 as 키워드를 사용했지만, 별도의 검증 로직이 필요합니다.
                return acc;
            },
            {} as Record<string, MemberConnection>
        );
    }

    async getRoomById(roomId: string) {
        const room = JSON.stringify(
            await this.redisService.get(`room:${roomId}`)
        );

        if (!room) return null;

        return room;
    }

    // async updateRoom(roomId: string, dto: UpdateRoomDto) {
    //     const room = await this.findRoom(roomId);
    //     if (!room) return null;
    //
    //     this.redisService.set(`room:${roomId}`, room);
    // }

    async findMyRoomId(socketId: string) {
        const keys = await this.redisService.getKeys(`join:*:${socketId}`);
        console.log("?");
        if (!keys.length) return null;
        return keys[0].split(":")[1];
    }

    async createRoom(dto: CreateRoomDto) {
        const roomId = generateRoomId();

        await this.redisService.set(
            `room:${roomId}`,
            {
                title: dto.title,
                createdAt: Date.now(),
                members: [dto.socketId],
                host: dto.socketId,
            } as Room,
            6 * HOUR
        );

        return roomId;
    }

    async addUser(
        roomId: string,
        socketId: string,
        nickname: string,
        isHost: boolean = false
    ) {
        const connections = await this.redisService.getKeys(
            `join:*:${socketId}`
        );

        if (connections.length > 0) {
            // overlapped connection error
            console.log(connections, "?");
            console.log(typeof connections);
            return;
        }

        const roomTTL = await this.redisService.getTTL(`room:${roomId}`);

        await this.redisService.set(
            `join:${roomId}:${socketId}`,
            {
                joinTime: Date.now(),
                isHost,
                nickname,
            } as MemberConnection,
            roomTTL
        );
    }

    async deleteUser(socketId: string) {
        const keys = await this.redisService.getKeys(`join:*:${socketId}`);
        console.log("지울 룸 아이디 : ", keys);
        await this.redisService.delete(...keys);
    }

    async deleteRoom(roomId: string) {
        console.log("지울 룸의 아이디 : ", roomId);
        await this.redisService.delete(`room:${roomId}`);
    }
}
