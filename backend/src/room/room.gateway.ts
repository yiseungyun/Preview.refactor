import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "./room.service";

const EVENT_NAME = {
    CREATE_ROOM: "create_room",
    JOIN_ROOM: "join_room",
    LEAVE_ROOM: "leave_room",
    MASTER_CHANGED: "master_changed",
    FINISH_ROOM: "finish_room",
    REACTION: "reaction",

    ROOM_CREATED: "room_created",
    USER_EXIT: "user_exit",
    ROOM_FULL: "room_full",
    ALL_USERS: "all_users",
    ROOM_FINISHED: "room_finished",
} as const;


/**
 * 연결과 관련된 에러를 처리
 *
 * 보다 연결과 관련된 코드가 존재
 */
@WebSocketGateway({
    cors: {
        origin: "*", // CORS 설정
    },
})
@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly roomService: RoomService) {}

    handleConnection(client: Socket) {
        console.log(`Client connected in room: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected in room: ${client.id}`);
        await this.handleLeaveRoom(client);
    }

    @SubscribeMessage(EVENT_NAME.CREATE_ROOM)
    async handleCreateRoom(client: Socket, data: any) {
        const { title, nickname } = data; // unknown 으로 받고, Dto와 Pipe로 검증받기
        try {
            const roomId = await this.roomService.createRoom(
                title,
                client.id,
                nickname ?? "Master"
            );
            client.join(roomId);
            this.server.to(roomId).emit(EVENT_NAME.ROOM_CREATED, { roomId });
        } catch (error) {
            console.error(error);
        }
    }

    @SubscribeMessage(EVENT_NAME.JOIN_ROOM)
    async handleJoinRoom(client: Socket, data: any) {
        const { roomId, nickname } = data;

        if (!(await this.roomService.checkAvailable(roomId))) {
            // client joins full room
            client.emit(EVENT_NAME.ROOM_FULL);
            return;
        }

        await this.roomService.joinRoom(client.id, roomId, nickname);

        client.join(roomId);

        console.log(`[${data.roomId}]: ${client.id} enter`);

        const usersInThisRoom = (
            await this.roomService.getMemberSocket(roomId)
        ).filter((user) => user !== client.id);

        client.emit(EVENT_NAME.ALL_USERS, usersInThisRoom);
    }

    @SubscribeMessage(EVENT_NAME.LEAVE_ROOM)
    async handleLeaveRoom(client: Socket) {
        const result = await this.roomService.leaveRoom(client.id);
        const roomId = result.roomId;

        if (Object.keys(result).length > 0) {
            this.server.to(roomId).emit(EVENT_NAME.MASTER_CHANGED, {
                masterSocketId: result.socketId,
                masterNickname: result.nickname,
            });
        }
        this.server
            .to(roomId)
            .emit(EVENT_NAME.USER_EXIT, { socketId: client.id });
    }

    @SubscribeMessage(EVENT_NAME.FINISH_ROOM)
    async handleFinishRoom(client: Socket) {
        const roomId = await this.roomService.finishRoom(client.id);
        this.server.to(roomId).emit(EVENT_NAME.ROOM_FINISHED);
    }
}
