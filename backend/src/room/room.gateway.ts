import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets";
import "dotenv/config";
import { Socket } from "socket.io";
import { RoomService } from "./services/room.service";
import { Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { EMIT_EVENT, LISTEN_EVENT } from "@/room/room.events";
import { CreateRoomDto } from "@/room/dto/create-room.dto";
import { WebsocketService } from "@/websocket/websocket.service";
import { JoinRoomDto } from "@/room/dto/join-room.dto";
import { RoomRepository } from "@/room/room.repository";
import { ReactionDto } from "@/room/dto/reaction.dto";
import { RoomLeaveService } from "@/room/services/room-leave.service";
import { RoomCreateService } from "@/room/services/room-create.service";
import { RoomJoinService } from "@/room/services/room-join.service";
import { websocketConfig } from "@/websocket/websocket.config";
import { FinishRoomDto } from "@/room/dto/finish-room.dto";
import { RoomIdDto } from "@/room/dto/room-id.dto";
import { MoveIndexDto } from "@/room/dto/move-index.dto";

@WebSocketGateway(websocketConfig)
export class RoomGateway implements OnGatewayDisconnect {
    private logger: Logger = new Logger("Room Gateway");

    public constructor(
        private readonly roomService: RoomService,
        private readonly roomLeaveService: RoomLeaveService,
        private readonly roomCreateService: RoomCreateService,
        private readonly roomJoinService: RoomJoinService,
        private readonly socketService: WebsocketService,
        private readonly roomRepository: RoomRepository
    ) {}

    public async handleDisconnect(client: Socket) {
        await this.handleLeaveRoom(client);
    }

    @SubscribeMessage(LISTEN_EVENT.CREATE)
    @UsePipes(new ValidationPipe({ transform: true }))
    public async handleCreateRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: CreateRoomDto
    ) {
        // TODO: try - catch 로 에러 핸들링을 통해 이벤트 Emit 을 여기서 하기
        await this.roomCreateService.createRoom({ ...dto, socketId: client.id });
    }

    @SubscribeMessage(LISTEN_EVENT.JOIN)
    @UsePipes(new ValidationPipe({ transform: true }))
    public async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: JoinRoomDto
    ) {
        await this.roomJoinService.joinRoom({ ...dto, socketId: client.id });
    }

    @SubscribeMessage(LISTEN_EVENT.LEAVE)
    public async handleLeaveRoom(client: Socket) {
        await this.roomLeaveService.leaveRoom(client);
    }

    @SubscribeMessage(LISTEN_EVENT.FINISH)
    @UsePipes(new ValidationPipe({ transform: true }))
    public async handleFinishRoom(@MessageBody() dto: FinishRoomDto) {
        const roomId = await this.roomService.finishRoom(dto.roomId);
        this.socketService.emitToRoom(roomId, EMIT_EVENT.FINISH);
    }

    @SubscribeMessage(LISTEN_EVENT.REACTION)
    @UsePipes(new ValidationPipe({ transform: true }))
    public async handleReaction(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: ReactionDto
    ) {
        const room = await this.roomRepository.getRoom(dto.roomId);

        if (!room) return;

        this.socketService.emitToRoom(room.id, EMIT_EVENT.REACTION, {
            socketId: client.id,
            reactionType: dto.reactionType,
        });
    }

    @SubscribeMessage(LISTEN_EVENT.START_PROGRESS)
    public async handleStartProgress(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: RoomIdDto
    ) {
        return this.toggleProgress(dto.roomId, client.id, true, EMIT_EVENT.START_PROGRESS);
    }

    @SubscribeMessage(LISTEN_EVENT.STOP_PROGRESS)
    public async handleStopProgress(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: RoomIdDto
    ) {
        return this.toggleProgress(dto.roomId, client.id, false, EMIT_EVENT.STOP_PROGRESS);
    }

    @SubscribeMessage(LISTEN_EVENT.NEXT_QUESTION)
    public async handleNextQuestion(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: RoomIdDto
    ) {
        this.socketService.emitToRoom(dto.roomId, EMIT_EVENT.NEXT_QUESTION, {
            currentIndex: await this.roomService.increaseIndex(dto.roomId, client.id),
        });
    }

    @SubscribeMessage(LISTEN_EVENT.CURRENT_INDEX)
    public async handleCurrentIndex(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: RoomIdDto
    ) {
        this.socketService.emitToRoom(dto.roomId, EMIT_EVENT.CURRENT_INDEX, {
            currentIndex: await this.roomService.getIndex(dto.roomId),
        });
    }

    @SubscribeMessage(LISTEN_EVENT.MOVE_INDEX)
    public async handleMoveIndex(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: MoveIndexDto
    ) {
        this.socketService.emitToRoom(dto.roomId, EMIT_EVENT.MOVE_INDEX, {
            currentIndex: await this.roomService.setIndex(dto.roomId, client.id, dto.index),
        });
    }

    private async toggleProgress(
        roomId: string,
        socketId: string,
        toStatus: boolean,
        eventName: string
    ) {
        try {
            const status = await this.roomService.setProgress(roomId, socketId, toStatus);
            this.socketService.emitToRoom(roomId, eventName, {
                status: "success",
                inProgress: status,
            });
        } catch {
            this.socketService.emitToRoom(roomId, eventName, {
                status: "error",
            });
        }
    }
}
