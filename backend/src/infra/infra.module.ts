import { Global, Module } from "@nestjs/common";
import { InfraService } from "@/infra/infra.service";
import { WebsocketRepository } from "@/infra/websocket/websocket.repository";
import { RedisOmModule } from "@moozeh/nestjs-redis-om";
import { RoomEntity } from "@/room/room.entity";
import { WebsocketEntity } from "@/infra/websocket/websocket.entity";

@Global()
@Module({
    imports: [RedisOmModule.forFeature([RoomEntity, WebsocketEntity])],
    providers: [InfraService, WebsocketRepository],
    exports: [InfraService, WebsocketRepository],
})
export class InfraModule {}
