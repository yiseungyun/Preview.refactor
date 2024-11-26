import { Injectable } from "@nestjs/common";
import { WebsocketService } from "@/websocket/websocket.service";
import { RoomRepository } from "@/room/room.repository";
import { RoomDto } from "@/room/dto/room.dto";
import { RoomHostService } from "@/room/services/room-host.service";
import { EMIT_EVENT } from "@/room/room.events";
import { Socket } from "socket.io";
import { WebsocketRepository } from "@/websocket/websocket.repository";

@Injectable()
export class RoomLeaveService {
    constructor(
        private readonly socketService: WebsocketService,
        private readonly socketRepository: WebsocketRepository,
        private readonly roomRepository: RoomRepository,
        private readonly roomHostService: RoomHostService
    ) {}

    async leaveRoom(socket: Socket) {
        const rooms = await this.socketRepository.getRoomOfSocket(socket.id);

        for await (const roomId of rooms.joinedRooms)
            await this.processRoomLeave(socket.id, roomId);
    }

    private async processRoomLeave(socketId: string, roomId: string) {
        const room = await this.roomRepository.getRoom(roomId);
        if (!room) return;

        room.connectionList = room.connectionList.filter(
            (connection) => connection.socketId !== socketId
        );

        if (!room.connectionList.length) return this.deleteRoom(room.roomId);

        await this.roomRepository.setRoom(room);

        if (room.host === socketId) return this.handleHostChange(socketId, room);

        this.socketService.emitToRoom(room.roomId, EMIT_EVENT.QUIT, { socketId });
    }

    private async handleHostChange(socketId: string, room: RoomDto) {
        if (room.host !== socketId) return;

        const newHost = await this.roomHostService.delegateHost(room.roomId);

        // TODO : throw new Exception : host changed
        this.socketService.emitToRoom(room.roomId, EMIT_EVENT.CHANGE_HOST, {
            nickname: newHost.nickname,
            socketId: newHost.socketId,
        });
    }

    private async deleteRoom(roomId: string) {
        await this.roomRepository.removeRoom(roomId);
        this.socketService.emitToRoom(roomId, EMIT_EVENT.QUIT, { roomId });
    }
}
