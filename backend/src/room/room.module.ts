import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomGateway } from "./room.gateway";
import { RoomRepository } from "./room.repository";
import { RoomController } from "./room.controller";
import { RedisOmModule } from "@moozeh/nestjs-redis-om";
import { RoomEntity } from "./room.entity";
import { QuestionListRepository } from "@/question-list/repository/question-list.repository";
import { InfraModule } from "@/infra/infra.module";
import { QuestionRepository } from "@/question-list/repository/question.respository";

@Module({
    imports: [RedisOmModule.forFeature([RoomEntity]), InfraModule],
    providers: [
        RoomService,
        RoomGateway,
        RoomRepository,
        QuestionListRepository,
        QuestionRepository,
    ],
    controllers: [RoomController],
})
export class RoomModule {}
