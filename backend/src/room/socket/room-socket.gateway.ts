import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    OnGatewayInit,
    MessageBody,
    ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "../services/room.service";
import { Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { EMIT_EVENT, LISTEN_EVENT } from "@/room/socket/room-socket.events";
import { CreateRoomDto } from "@/room/dto/create-room.dto";
import { RoomSocketService } from "@/room/socket/room-socket.service";
import { JoinRoomDto } from "@/room/dto/join-room.dto";
import { RoomRepository } from "@/room/room.repository";
import { ReactionDto } from "@/room/dto/reaction.dto";
import { RoomSocketRepository } from "@/room/socket/room-socket.repository";
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

@WebSocketGateway()
export class RoomSocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    private server: Server;

    public constructor(
        private readonly roomService: RoomService,
        private readonly socketService: RoomSocketService,
        private readonly socketRepository: RoomSocketRepository,
        private readonly roomRepository: RoomRepository
    ) {}

    public async handleConnection(client: Socket) {
        Logger.log(`Client connected: ${client.id}`);
        await this.socketRepository.register(client);
    }

    public async handleDisconnect(client: Socket) {
        Logger.log(`Client disconnected: ${client.id}`);
        await this.handleLeaveRoom(client);
        await this.socketRepository.clean(client);
    }

    public async afterInit() {
        const pubClient = new Redis({
            host: "localhost",
            port: 6379,
        });

        const subClient = pubClient.duplicate();

        const redisAdapter = createAdapter(pubClient, subClient);
        this.server.adapter(redisAdapter);

        this.roomService.setServer(this.server);
    }

    @SubscribeMessage(LISTEN_EVENT.CREATE)
    @UsePipes(new ValidationPipe({ transform: true }))
    public async handleCreateRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: CreateRoomDto
    ) {
        await this.roomService.createRoom({ ...dto, socketId: client.id });
    }

    @SubscribeMessage(LISTEN_EVENT.JOIN)
    @UsePipes(ValidationPipe)
    public async handleJoinRoom(client: Socket, dto: JoinRoomDto) {
        await this.roomService.joinRoom({ ...dto, socketId: client.id });
    }

    @SubscribeMessage(LISTEN_EVENT.LEAVE)
    public async handleLeaveRoom(client: Socket) {
        await this.roomService.leaveRoom(client);
    }

    @SubscribeMessage(LISTEN_EVENT.FINISH)
    public async handleFinishRoom(client: Socket) {
        const roomId = await this.roomService.finishRoom(client.id);
        this.socketService.emitToRoom(roomId, EMIT_EVENT.FINISH);
    }

    @SubscribeMessage(LISTEN_EVENT.REACTION)
    @UsePipes(ValidationPipe)
    public async handleReaction(client: Socket, dto: ReactionDto) {
        const room = await this.roomRepository.getRoom(dto.socketId);
        if (!room) return;
        this.socketService.emitToRoom(room.roomId, EMIT_EVENT.REACTION, dto);
    }
}
