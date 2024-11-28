import { Global, Module } from "@nestjs/common";
import { WebsocketService } from "@/websocket/websocket.service";
import { WebsocketGateway } from "@/websocket/websocket.gateway";
import { WebsocketRepository } from "@/websocket/websocket.repository";
import { RedisOmModule } from "@moozeh/nestjs-redis-om";
import { RoomEntity } from "@/room/room.entity";
import { WebsocketEntity } from "@/websocket/websocket.entity";

@Global()
@Module({
    imports: [RedisOmModule.forFeature([RoomEntity, WebsocketEntity])],
    providers: [WebsocketGateway, WebsocketService, WebsocketRepository],
    exports: [WebsocketService, WebsocketRepository],
})
export class WebsocketModule {}
