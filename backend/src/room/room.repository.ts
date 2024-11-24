import { Injectable } from "@nestjs/common";
import { InjectRepository } from "nestjs-redis-om";
import { Repository } from "redis-om";
import { RoomEntity } from "@/room/room.entity";
import { RoomDto } from "@/room/dto/room.dto";

@Injectable()
export class RoomRepository {
    public constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>
    ) {}

    // TODO : .from 메서드 구현 필요?
    public async getAllRoom(): Promise<RoomDto[]> {
        const allRooms = await this.roomRepository.search().return.all();
        return allRooms.map((room: RoomEntity) => ({
            connectionList: JSON.parse(room.connectionList),
            createdAt: room.createdAt,
            host: room.host,
            maxParticipants: room.maxParticipants,
            status: room.status,
            title: room.title,
            roomId: room.roomId,
        }));
    }

    public async getRoom(id: string): Promise<RoomDto> {
        const room = await this.roomRepository.search().where("roomId").eq(id).return.first();
        console.log(room);
        if (!room.roomId) return null;
        console.log(room.roomId, room.connectionList);
        return {
            connectionList: JSON.parse(room.connectionList),
            createdAt: room.createdAt,
            host: room.host,
            maxParticipants: room.maxParticipants,
            status: room.status,
            title: room.title,
            roomId: room.roomId,
        };
    }

    public async setRoom(dto: RoomDto): Promise<void> {
        const room = new RoomEntity();
        room.roomId = dto.roomId;
        room.title = dto.title;
        room.status = dto.status;
        room.connectionList = JSON.stringify(dto.connectionList);
        room.maxParticipants = dto.maxParticipants;
        room.createdAt = Date.now();
        room.host = dto.host;

        await this.roomRepository.save(room.roomId, room);
    }

    public async removeRoom(id: string): Promise<void> {
        const entities = await this.roomRepository.search().where("roomId").equals(id).return.all();

        for await (const entity of entities) {
            await this.roomRepository.remove(entity.roomId);
        }
    }
}
