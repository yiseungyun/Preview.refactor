import { Injectable } from "@nestjs/common";
import { EMIT_EVENT } from "@/room/room.events";
import { WebsocketService } from "@/websocket/websocket.service";
import { RoomRepository } from "@/room/room.repository";
import { RoomDto } from "@/room/dto/room.dto";
import { JoinRoomInternalDto } from "@/room/dto/join-room.dto";
import { WebsocketRepository } from "@/websocket/websocket.repository";
import { QuestionListRepository } from "@/question-list/question-list.repository";

@Injectable()
export class RoomJoinService {
    public constructor(
        private readonly roomRepository: RoomRepository,
        private readonly socketService: WebsocketService,
        private readonly socketRepository: WebsocketRepository,
        private readonly questionListRepository: QuestionListRepository
    ) {}

    public async joinRoom(dto: JoinRoomInternalDto) {
        const { roomId, socketId, nickname } = dto;

        const room = await this.roomRepository.getRoom(roomId);
        const socket = this.socketService.getSocket(socketId);

        if (!socket) throw new Error("Invalid Socket");

        if (!room) throw new Error("RoomEntity Not found");

        if (room.inProgress) return socket.emit(EMIT_EVENT.IN_PROGRESS, {});

        if (this.isFullRoom(room)) return socket.emit(EMIT_EVENT.FULL, {});

        socket.join(roomId);

        await this.socketRepository.joinRoom(socket.id, roomId);

        room.connectionMap[socketId] = {
            socketId,
            createAt: Date.now(),
            nickname,
        };

        await this.roomRepository.setRoom(room);

        room.connectionMap[socketId] = undefined;

        const questionListContents = await this.questionListRepository.getContentsByQuestionListId(
            room.questionListId
        );

        // TODO: 성공 / 실패 여부를 전송하는데 있어서 결과에 따라 다르게 해야하는데.. 어떻게 관심 분리를 할까?
        socket.emit(EMIT_EVENT.JOIN, {
            ...room,
            questionListContents,
        });
    }

    private isFullRoom(room: RoomDto): boolean {
        return room.maxParticipants <= Object.keys(room.connectionMap).length;
    }
}
