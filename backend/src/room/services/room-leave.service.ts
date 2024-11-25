import { Injectable } from "@nestjs/common";
import { RoomSocketService } from "@/room/socket/room-socket.service";
import { RoomRepository } from "@/room/room.repository";
import { RoomDto } from "@/room/dto/room.dto";
import { RoomHostService } from "@/room/services/room-host.service";
import { EMIT_EVENT } from "@/room/socket/room-socket.events";
import { Socket } from "socket.io";
import { RoomSocketRepository } from "@/room/socket/room-socket.repository";

@Injectable()
export class RoomLeaveService {
    constructor(
        private readonly socketService: RoomSocketService,
        private readonly socketRepository: RoomSocketRepository,
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

        await this.leaveSocket(socketId, room);

        if (room.host === socketId) await this.handleHostChange(socketId, room);
        else this.socketService.emitToRoom(room.roomId, EMIT_EVENT.QUIT, { socketId });

        if (!room.connectionList.length) await this.deleteRoom(socketId);
    }

    private async leaveSocket(socketId: string, room: RoomDto) {
        await this.socketService.leaveRoom(socketId, room.roomId);

        // TODO : 엄청 비효율적인 코드라고 생각하는데 개선할 방법 찾기
        room.connectionList = room.connectionList.filter(
            (connection) => connection.socketId !== socketId
        );

        await this.roomRepository.setRoom(room);
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
