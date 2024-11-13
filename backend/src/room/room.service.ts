import { Injectable } from "@nestjs/common";
import { MemberConnection, Room } from "./room.model";
import { generateRoomId } from "../utils/generateRoomId";
import { HOUR } from "../utils/time";
import { RoomRepository } from "./room.repository";
import { UpdateRoomDto } from "./dto/update-room.dto";

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
        console.log("겟멤버소켓 :", roomId);
        const memberConnection =
            await this.roomRepository.getRoomMemberConnection(roomId);
        if (!memberConnection) return null;

        return Object.keys(memberConnection);
    }

    async checkAvailable(roomId: string) {
        const members =
            await this.roomRepository.getRoomMemberConnection(roomId);
        console.log(members);
        return Object.keys(members).length < RoomService.MAX_MEMBERS;
    }

    async checkConnected(socketId: string) {
        return this.roomRepository.findMyRoomId(socketId);
    }

    async disconnect(socketId: string) {
        const roomId = await this.roomRepository.findMyRoomId(socketId);

        if (!roomId) {
            return;
        }

        await this.roomRepository.deleteUser(socketId);

        const connections =
            await this.roomRepository.getRoomMemberConnection(roomId);
        console.log("커넥션 정보 : ", connections);
        if (!connections) await this.roomRepository.deleteRoom(roomId);
    }
}
