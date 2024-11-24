import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { InjectRepository } from "nestjs-redis-om";
import { Repository } from "redis-om";
import { RoomSocketEntity } from "@/room/socket/room-socket.entity";

@Injectable()
export class RoomSocketRepository {
    public constructor(
        @InjectRepository(RoomSocketEntity)
        private readonly socketRepository: Repository<RoomSocketEntity>
    ) {}

    public async register(socket: Socket) {
        const entity = new RoomSocketEntity();
        entity.id = socket.id;
        entity.joinedRooms = [];
        await this.socketRepository.remove(entity.id);
        await this.socketRepository.save(entity.id, entity);
    }

    public async getRoomOfSocket(id: string) {
        return this.socketRepository.search().where("id").eq(id).return.first();
    }

    public async clean(socket: Socket) {
        const entities = await this.socketRepository
            .search()
            .where("id")
            .equals(socket.id)
            .return.all();

        for await (const entity of entities) {
            await this.socketRepository.remove(entity.id);
        }
    }

    public async joinRoom(socketId: string, roomId: string) {
        const entity = await this.socketRepository.search().where("id").eq(socketId).return.first();
        entity.joinedRooms.push(roomId);
        await this.socketRepository.save(entity.id, entity);
    }
}
