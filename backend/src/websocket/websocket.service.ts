import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import Redis from "ioredis";

@Injectable()
export class WebsocketService {
    constructor() {}

    private server: Server;
    private redisClient: Redis;

    public setRedisClient(client: Redis) {
        this.redisClient = client;
    }

    public setServer(server: Server) {
        this.server = server;
    }

    public getRedisClient() {
        return this.redisClient;
    }

    public getServer() {
        return this.server;
    }

    public getSocket(socketId: string) {
        return this.server.sockets.sockets.get(socketId);
    }

    public emitToRoom(roomId: string, event: string, data?: any) {
        this.server.to(roomId).emit(event, data);
    }
}
