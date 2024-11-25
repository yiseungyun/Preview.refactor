import { Injectable } from "@nestjs/common";
import { RoomStatus } from "@/room/room.entity";
import { Server, Socket } from "socket.io";
import { CreateRoomInternalDto } from "@/room/dto/create-room.dto";
import { generateRoomId } from "@/utils/generateRoomId";
import { EMIT_EVENT } from "@/room/socket/room-socket.events";
import { RoomSocketService } from "@/room/socket/room-socket.service";
import { RoomLeaveService } from "@/room/services/room-leave.service";
import { RoomRepository } from "@/room/room.repository";
import { RoomDto } from "@/room/dto/room.dto";
import { JoinRoomInternalDto } from "@/room/dto/join-room.dto";
import { RoomSocketRepository } from "@/room/socket/room-socket.repository";
import { QuestionListRepository } from "@/question-list/question-list.repository";

@Injectable()
export class RoomService {
    public constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomLeaveService: RoomLeaveService,
        private readonly socketService: RoomSocketService,
        private readonly socketRepository: RoomSocketRepository,
        private readonly questionListRepository: QuestionListRepository
    ) {}

    public setServer(server: Server) {
        this.socketService.setServer(server);
    }

    public async getPublicRoom() {
        const rooms = await this.roomRepository.getAllRoom();
        return rooms
            .filter((room) => room.status === RoomStatus.PUBLIC)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    public async leaveRoom(socket: Socket) {
        return this.roomLeaveService.leaveRoom(socket);
    }

    public async createRoom(dto: CreateRoomInternalDto) {
        const roomId = generateRoomId();
        const currentTime = Date.now();

        const roomDto = {
            ...dto,
            roomId,
            connectionList: [
                {
                    socketId: dto.socketId,
                    createAt: currentTime,
                    nickname: dto.nickname,
                },
            ],
            questionListContents: await this.questionListRepository.getContentsByQuestionListId(
                dto.questionListId
            ),
            createdAt: currentTime,
            host: dto.socketId,
        };
        await this.roomRepository.setRoom(roomDto);

        const socket = this.socketService.getSocket(dto.socketId);
        socket.join(roomId);
        await this.socketRepository.joinRoom(socket.id, roomId);
        this.socketService.emitToRoom(roomId, EMIT_EVENT.CREATE, roomDto);
    }

    public async joinRoom(dto: JoinRoomInternalDto) {
        const { roomId, socketId, nickname } = dto;

        const room = await this.roomRepository.getRoom(roomId);
        const socket = this.socketService.getSocket(socketId);

        if (!socket) throw new Error("Invalid Socket");

        if (room.roomId === null) throw new Error("Redis: RoomEntity Entity type error");

        // TODO : 에러를 보내기 ->  Exception 생성해서 분류
        if (this.isFullRoom(room)) return socket.emit(EMIT_EVENT.FULL, {});

        // TODO : join room 하는 단계가 3가지가 같이 혼재 -> 이것만 따로 묶어보기?
        socket.join(roomId);
        await this.socketRepository.joinRoom(socket.id, roomId);
        room.connectionList.push({
            socketId,
            createAt: Date.now(),
            nickname,
        });

        await this.roomRepository.setRoom(room);

        // TODO: 성공 / 실패 여부를 전송하는데 있어서 결과에 따라 다르게 해야하는데.. 어떻게 관심 분리를 할까?
        this.socketService.emitToRoom(roomId, EMIT_EVENT.JOIN, room);
    }

    private isFullRoom(room: RoomDto): boolean {
        return room.maxParticipants <= room.connectionList.length;
    }

    public async finishRoom(roomId: string) {
        await this.roomRepository.removeRoom(roomId);
        return roomId;
    }
}
