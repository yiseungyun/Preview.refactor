import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@moozeh/nestjs-redis-om";
import { Repository } from "redis-om";
import { RoomEntity } from "@/room/room.entity";

@Injectable()
export class RoomRepository {
    public constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>
    ) {}

    // TODO : .from 메서드 구현 필요?
    public async getAllRoom(): Promise<RoomEntity[]> {
        return this.roomRepository.search().return.all();
    }

    public async getRoom(id: string): Promise<RoomEntity | null> {
        const room = await this.roomRepository.search().where("id").eq(id).return.first();
        if (!room) return null;
        return room;
    }

    public async setRoom(entity: RoomEntity): Promise<void> {
        await this.roomRepository.save(entity.id, entity);
    }

    public async removeRoom(id: string): Promise<void> {
        const entities = await this.roomRepository.search().where("id").equals(id).return.all();

        for await (const entity of entities) {
            await this.roomRepository.remove(entity.id);
        }
    }
}
