import { Module } from "@nestjs/common";
import { RoomService } from "./services/room.service";
import { RoomSocketGateway } from "./socket/room-socket.gateway";
import { RoomRepository } from "./room.repository";
import { RoomController } from "./room.controller";
import { RedisOmModule } from "nestjs-redis-om";
import { RoomEntity } from "./room.entity";
import { RoomLeaveService } from "@/room/services/room-leave.service";
import { RoomSocketService } from "@/room/socket/room-socket.service";
import { RoomHostService } from "@/room/services/room-host.service";
import { RoomSocketRepository } from "@/room/socket/room-socket.repository";
import { RoomSocketEntity } from "@/room/socket/room-socket.entity";
import { QuestionListRepository } from "@/question-list/question-list.repository";

@Module({
    imports: [RedisOmModule.forFeature([RoomEntity, RoomSocketEntity])],
    providers: [
        RoomService,
        RoomSocketGateway,
        RoomRepository,
        RoomLeaveService,
        RoomSocketService,
        RoomHostService,
        RoomSocketRepository,
        QuestionListRepository,
    ],
    controllers: [RoomController],
})
export class RoomModule {}
