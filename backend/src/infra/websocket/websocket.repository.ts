import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { InjectRepository } from "@moozeh/nestjs-redis-om";
import { Repository } from "redis-om";
import { WebsocketEntity } from "@/infra/websocket/websocket.entity";

@Injectable()
export class WebsocketRepository {
    public constructor(
        @InjectRepository(WebsocketEntity)
        private readonly socketRepository: Repository<WebsocketEntity>
    ) {}

    public async createWebsocketMetadata(socket: Socket) {
        const entity = new WebsocketEntity();
        entity.id = socket.id;
        entity.joinedRooms = [];
        return this.socketRepository.save(entity.id, entity);
    }

    public async getWebsocketMetadataById(id: string) {
        return this.socketRepository.search().where("id").eq(id).return.first();
    }

    public async removeWebsocketMetadata(socket: Socket) {
        const entities = await this.socketRepository
            .search()
            .where("id")
            .equals(socket.id)
            .return.all();

        for await (const entity of entities) {
            await this.socketRepository.remove(entity.id);
        }
    }

    public async updateWebsocketMetadata(socketId: string, entity: WebsocketEntity) {
        return this.socketRepository.save(entity.id, entity);
    }
}
