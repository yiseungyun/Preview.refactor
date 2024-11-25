import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class RoomSocketService {
    constructor() {}

    private server: Server;

    public setServer(server: Server) {
        this.server = server;
    }

    public getSocket(socketId: string) {
        return this.server.sockets.sockets.get(socketId);
    }

    public async leaveRoom(socketId: string, roomId: string) {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
            await socket.leave(roomId);
        }
    }

    public emitToRoom(roomId: string, event: string, data?: any) {
        this.server.to(roomId).emit(event, data);
    }
}
