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
    MASTER_CHANGED: "master_changed",
    FINISH_ROOM: "finish_room",
    REACTION: "reaction",

    USER_EXIT: "user_exit",
    ROOM_FULL: "room_full",
    ALL_USERS: "all_users",
} as const;

interface User {
    id: string;
    nickname: string;
}

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

    private users: { [key: string]: User[] } = {};
    private socketToRoom: { [key: string]: string } = {};
    private maximum = 5;

    async handleConnection(client: Socket) {
        console.log(`Client connected in room: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected in room: ${client.id}`);
        await this.roomService.disconnect(client.id);
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
            this.server.emit(EVENT_NAME.CREATE_ROOM, { roomId });
            return roomId;
        } catch (error) {
            console.error(error);
            return null;
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
}
