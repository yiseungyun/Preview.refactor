import { Injectable } from "@nestjs/common";
import { RoomRepository } from "./room.repository";

/**
 * 비즈니스 로직 처리를 좀 더 하게 하기 위한 클래스로 설정
 * 예외 처리 (로직, 더 밑단 에러 처리 - redis 에러 등) 도 이곳에서 이루어질 예정
 * redis 와 관련된 부분은 모르도록 하려고 합니다.
 */
@Injectable()
export class RoomService {
    private static MAX_MEMBERS = 5;
    constructor(private readonly roomRepository: RoomRepository) {}

    async getPublicRoom() {
        const rooms = await this.roomRepository.getAllRoom();
        return rooms.filter((room) => room.status === "PUBLIC");
    }

    async getRoomId(socketId: string) {
        return this.roomRepository.findMyRoomId(socketId);
    }

    async createRoom(dto: CreateRoomDto) {
        const { title, status, maxParticipants, socketId, nickname } = dto;
        const roomId = await this.roomRepository.createRoom({
            title,
            status: "PUBLIC",
            socketId,
        });
        await this.roomRepository.addUser(roomId, socketId, nickname, true);
        return roomId;
    }

    async joinRoom(socketId: string, roomId: string, nickname: string) {
        const room = this.roomRepository.getRoomById(roomId);
        if (!room) return null; // throw join error
        await this.roomRepository.addUser(roomId, socketId, nickname);
    }

    async getMemberSocket(roomId: string) {
        const memberConnection =
            await this.roomRepository.getRoomMemberConnection(roomId);
        if (!memberConnection) return null;

        return Object.keys(memberConnection);
    }

    async checkAvailable(roomId: string) {
        const room = await this.roomRepository.getRoomById(roomId);
        const members =
            await this.roomRepository.getRoomMemberConnection(roomId);

        return Object.keys(members).length < RoomService.MAX_MEMBERS;
    }

    async checkHost(socketId: string) {
        return await this.roomRepository.checkHost(socketId);
    }

    async checkConnected(socketId: string) {
        return this.roomRepository.findMyRoomId(socketId);
    }

    async leaveRoom(socketId: string) {
        const roomId = await this.roomRepository.findMyRoomId(socketId);

        if (!roomId) return null;

        await this.roomRepository.deleteUser(socketId);

        return this.roomRepository.getRoomMemberCount(roomId);
    }

    async delegateHost(roomId: string) {
        const newHost = await this.roomRepository.getNewHost(roomId);
        await this.roomRepository.setNewHost(roomId, newHost.socketId);
        return newHost;
    }

    async finishRoom(socketId: string) {
        const roomId = await this.roomRepository.findMyRoomId(socketId);
        await this.roomRepository.deleteRoom(roomId);
        return roomId;
    }

    async deleteRoom(roomId: string) {
        await this.roomRepository.deleteRoom(roomId);
    }
}
