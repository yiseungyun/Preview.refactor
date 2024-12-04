import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import Redis from "ioredis";
import { redisClient } from "@/infra/redis/redis-client";
import { WebsocketRepository } from "@/infra/websocket/websocket.repository";

@Injectable()
export class InfraService {
    private server: Server;
    private readonly redisClient: Redis = redisClient;

    constructor(private readonly websocketRepository: WebsocketRepository) {}

    public setServer(server: Server) {
        this.server = server;
    }

    public async createSocketMetadata(socket: Socket) {
        return this.websocketRepository.createWebsocketMetadata(socket);
    }

    public async getSocketMetadata(socket: Socket) {
        return this.websocketRepository.getWebsocketMetadataById(socket.id);
    }

    public async removeSocketMetadata(socket: Socket) {
        await this.websocketRepository.removeWebsocketMetadata(socket);
    }

    public async joinRoom(socket: Socket, roomId: string) {
        const entity = await this.websocketRepository.getWebsocketMetadataById(socket.id);
        entity.joinedRooms.push(roomId);
        await this.websocketRepository.updateWebsocketMetadata(socket.id, entity);
        socket.join(roomId);
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
