import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

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
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

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
                    this.server.to(roomID).emit("user_exit", { id: client.id });
                }
            }
        }
    }

    @SubscribeMessage("join_room")
    handleJoinRoom(client: Socket, data: { room: string; nickname: string }) {
        if (this.users[data.room]) {
            if (this.users[data.room].length === this.maximum) {
                client.emit("room_full");
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
        client.emit("all_users", usersInThisRoom);
    }
}
