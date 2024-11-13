import { Injectable } from "@nestjs/common";
import { Room } from "./room.model";
import { RoomRepository } from "./room.repository";

import { generateRoomId } from "../utils/generateRoomId";
import { HOUR } from "../utils/time";

@Injectable()
export class RoomService {
    private static MAX_MEMBERS = 5;
    constructor(private readonly roomRepository: RoomRepository) {}

    async getPublicRoom() {
        const rooms = await this.roomRepository.getAllRoom();
        return rooms.filter((room) => room.status === "PUBLIC");
    }

    async createRoom(title: string, socketId: string, nickname: string) {
        const roomId = await this.roomRepository.createRoom({
            title,
            status: "PUBLIC",
            socketId,
        });
        await this.roomRepository.addUser(roomId, socketId, nickname, true);
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
        const members =
            await this.roomRepository.getRoomMemberConnection(roomId);

        return Object.keys(members).length < RoomService.MAX_MEMBERS;
    }

    async checkConnected(socketId: string) {
        return this.roomRepository.findMyRoomId(socketId);
    }

    async leaveRoom(socketId: string) {
        const roomId = await this.roomRepository.findMyRoomId(socketId);

        if (!roomId) {
            return { roomId: null };
        }

        // 퇴장 로직
        // 0 방에 유저가 본인만 남음 -> (master이던 말던) 방 삭제 -> return 0(인원수)
        // 1 해당 유저가 master인지 확인
        // 1.1 master라면? -> 유저 퇴장 -> 새로운 Master 정해주기 -> return 새로운 master socketId  -> master_changed 이벤트 발생
        // 1.2 master가 아니라면? -> 유저 퇴장 -> return 인원수 -> gateway에서 user_exit 이벤트 발생
        const roomMemberCount =
            await this.roomRepository.getRoomMemberCount(roomId);
        if (roomMemberCount === 1) {
            await this.roomRepository.deleteRoom(roomId);
            return { roomId };
        } else {
            const isHost = await this.roomRepository.checkHost(socketId);
            await this.roomRepository.deleteUser(socketId);
            if (isHost === "true") {
                const newHost = await this.roomRepository.getNewHost(roomId);
                await this.roomRepository.setNewHost(roomId, newHost.socketId);
                return {
                    roomId,
                    socketId: newHost.socketId,
                    nickname: newHost.nickname,
                };
            } else return { roomId };
        }
    }

    async finishRoom(socketId: string) {
        const roomId = await this.roomRepository.findMyRoomId(socketId);
        await this.roomRepository.deleteRoom(roomId);
        return roomId;
    }
}
