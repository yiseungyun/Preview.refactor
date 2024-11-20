import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { MemberConnection, Room } from "./room.model";
import { generateRoomId } from "../utils/generateRoomId";
import { HOUR } from "../utils/time";
import { CreateRoomDto } from "./dto/create-room.dto";

/**
 * `room:` 과 같은 태그를 사용하는 부분
 * 실제 더 복잡한 비즈니스 로직을 처리할 수 있도록 함수를 일반화 하려고 합니다.
 */
@Injectable()
export class RoomRepository {
    constructor(private readonly redisService: RedisService) {}

    async getAllRoom(): Promise<Record<string, Room>> {
        const redisMap = await this.redisService.getMap("room:*");
        console.log(redisMap);

        if (!redisMap) return {};

        return Object.entries(redisMap).reduce(
            (acc, [roomId, room]) => {
                acc[roomId.split(":")[1]] = room as Room;
                return acc;
            },
            {} as Record<string, Room>
        );
    }

    async getRoomMemberConnection(callerId: string, roomId: string) {
        const room = await this.getRoomById(roomId);
        const connectionMap = await this.redisService.getMap(
            `join:${roomId}:*`
        );

        if (!connectionMap) return {};

        return Object.entries(connectionMap).reduce(
            (acc, [socketId, connection]) => {
                socketId = socketId.split(":")[2];

                acc[socketId] = {
                    ...(connection as MemberConnection),
                    isHost: room.host === socketId,
                } as MemberConnection; // 현재 as 키워드를 사용했지만, 별도의 검증 로직이 필요합니다.
                return acc;
            },
            {} as Record<string, MemberConnection>
        );
    }

    async checkHost(socketId: string) {
        const roomId = await this.findMyRoomId(socketId);

        const room = JSON.parse(await this.redisService.get(`room:${roomId}`));
        if (!room) return false;
        return socketId === room.host;
    }

    async getRoomById(roomId: string) {
        const room = JSON.parse(await this.redisService.get(`room:${roomId}`));

        if (!room) return null;

        return room as Room;
    }

    async findMyRoomId(socketId: string) {
        const keys = await this.redisService.getKeys(`join:*:${socketId}`);
        if (!keys.length) return null;
        return keys[0].split(":")[1];
    }

    async getRoomMemberCount(roomId: string) {
        const keys = await this.redisService.getKeys(`join:${roomId}:*`);

        return keys.length;
    }

    async getNewHost(roomId: string) {
        const memberKeys = await this.redisService.getKeys(`join:${roomId}:*`);
        const members = [];
        for (const key of memberKeys) {
            const socketId = key.split(":")[2];
            const value = await this.redisService.get(
                `join:${roomId}:${socketId}`
            );
            const result = JSON.parse(value);
            members.push({
                socketId,
                joinTime: result.joinTime,
                nickname: result.nickname,
            });
        }

        const sortedMembers = members.sort((a, b) => a.joinTime - b.joinTime);
        return sortedMembers[0] as {
            joinTime: number;
            nickname: string;
            socketId: string;
        };
    }

    async setNewHost(roomId: string, newHostId: string) {
        const room = JSON.parse(await this.redisService.get(`room:${roomId}`));
        const roomTTL = await this.redisService.getTTL(`room:${roomId}`);

        await this.redisService.set(
            `room:${roomId}`,
            {
                ...room,
                host: newHostId,
            },
            roomTTL
        );
    }

    async createRoom(dto: CreateRoomDto) {
        const { title, socketId, maxParticipants, status } = dto;
        const roomId = generateRoomId();

        await this.redisService.set(
            `room:${roomId}`,
            {
                title,
                createdAt: Date.now(),
                host: socketId,
                maxParticipants,
                status,
            } as Room,
            6 * HOUR
        );

        return roomId;
    }

    async addUser(roomId: string, socketId: string, nickname: string) {
        const connections = await this.redisService.getKeys(
            `join:*:${socketId}`
        );

        if (connections.length > 0) {
            // overlapped connection error
        }

        const roomTTL = await this.redisService.getTTL(`room:${roomId}`);

        await this.redisService.set(
            `join:${roomId}:${socketId}`,
            {
                joinTime: Date.now(),
                nickname,
            } as MemberConnection,
            roomTTL
        );
    }

    async deleteUser(socketId: string) {
        const keys = await this.redisService.getKeys(`join:*:${socketId}`);

        await this.redisService.delete(...keys);
    }

    async deleteRoom(roomId: string) {
        await this.redisService.delete(`room:${roomId}`);
    }
}
