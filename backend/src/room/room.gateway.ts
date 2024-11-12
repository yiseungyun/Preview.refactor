import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
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

    handleConnection(client: Socket) {
        console.log(`Client connected in room: ${client.id}`);
    }

    handleDisconnect(client: Socket): any {
        console.log(`Client disconnected in room: ${client.id}`);
        const roomID = this.socketToRoom[client.id];
        if (roomID) {
            const room = this.users[roomID];
            if (room) {
                this.users[roomID] = room.filter(
                    (user) => user.id !== client.id
                );
                if (this.users[roomID].length === 0) {
                    delete this.users[roomID];
                } else {
                    this.server.to(roomID).emit(EVENT_NAME.USER_EXIT, { id: client.id });
                }
            }
        }
    }

    @SubscribeMessage(EVENT_NAME.CREATE_ROOM)
    async handleCreateRoom(client: Socket, data: { title }) {
        try {
            const roomId = await this.roomService.createRoom(
                data.title,
                client.id
            );
            this.server.emit(`room_created`, { roomId });
        } catch(error) {
            console.error(error);
            return null;
        }
    }


    @SubscribeMessage(EVENT_NAME.JOIN_ROOM)
    handleJoinRoom(client: Socket, data: { room: string; nickname: string }) {
        if (this.users[data.room]) {
            if (this.users[data.room].length === this.maximum) {
                client.emit(EVENT_NAME.ROOM_FULL);
                return;
            }
            this.users[data.room].push({
                id: client.id,
                nickname: data.nickname,
            });
        } else {
            this.users[data.room] = [
                { id: client.id, nickname: data.nickname },
            ];
        }

        this.socketToRoom[client.id] = data.room;
        client.join(data.room);
        console.log(`[${data.room}]: ${client.id} enter`);

        const usersInThisRoom = this.users[data.room].filter(
            (user) => user.id !== client.id
        );
        client.emit(EVENT_NAME.ALL_USERS, usersInThisRoom);
    }
}
