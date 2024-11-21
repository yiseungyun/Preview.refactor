import { Injectable } from "@nestjs/common";
import { RoomRepository } from "./room.repository";
import { CreateRoomDto } from "./dto/create-room.dto";
import { MemberConnection } from "./room.model";
import { QuestionListRepository } from "../question-list/question-list.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionList } from "../question-list/question-list.entity";

/**
 * 비즈니스 로직 처리를 좀 더 하게 하기 위한 클래스로 설정
 * 예외 처리 (로직, 더 밑단 에러 처리 - redis 에러 등) 도 이곳에서 이루어질 예정
 * redis 와 관련된 부분은 모르도록 하려고 합니다.
 */
@Injectable()
export class RoomService {
    private static MAX_MEMBERS = 5;

    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly questionListRepository: QuestionListRepository
    ) {}

    async getPublicRoom() {
        const rooms = await this.roomRepository.getAllRoom();
        const roomList = [];
        Object.entries(rooms).forEach(([roomId, roomData]) => {
            if (roomData.status === "PRIVATE") return;
            roomList.push({
                id: roomId,
                title: roomData.title,
                category: "프론트엔드",
                inProgress: false,
                host: {
                    nickname: "방장",
                    socketId: roomData.host,
                },
                participant: 1,
                maxParticipant: roomData.maxParticipants,
                createAt: roomData.createdAt,
            });
        });

        return roomList.sort((a, b) => b.createAt - a.createAt);
    }

    async getRoomId(socketId: string) {
        return this.roomRepository.findMyRoomId(socketId);
    }

    async createRoom(dto: CreateRoomDto) {
        const {
            title,
            status,
            maxParticipants,
            socketId,
            nickname,
            questionListId,
        } = dto;
        const roomId = await this.roomRepository.createRoom({
            title,
            status: status ?? "PUBLIC",
            maxParticipants: maxParticipants ?? RoomService.MAX_MEMBERS,
            socketId,
            nickname: nickname ?? "Master",
            questionListId,
        });

        await this.roomRepository.addUser(roomId, dto.socketId, dto.nickname);
        const questionListContents =
            await this.questionListRepository.getContentsByQuestionListId(
                questionListId
            );

        return {
            roomId,
            roomMetadata: {
                title,
                status: status ?? "PUBLIC",
                maxParticipants: maxParticipants ?? RoomService.MAX_MEMBERS,
                host: socketId,
                nickname: nickname ?? "Master",
                questionListContents,
            },
        };
    }

    async joinRoom(socketId: string, roomId: string, nickname: string) {
        const room = this.roomRepository.getRoomById(roomId);
        if (!room) return null; // throw join error
        await this.roomRepository.addUser(roomId, socketId, nickname);
        return room;
    }

    async getRoomMemberConnection(callerId: string, roomId: string) {
        const memberConnection =
            await this.roomRepository.getRoomMemberConnection(callerId, roomId);
        if (!memberConnection) return null;

        return Object.entries(memberConnection).reduce(
            (acc, [id, memberConnection]) => {
                if (callerId !== id) {
                    acc[id] = memberConnection;
                }
                return acc;
            },
            {} as Record<string, MemberConnection>
        );
    }

    async checkAvailable(socketId: string, roomId: string) {
        const room = await this.roomRepository.getRoomById(roomId);
        const members = await this.roomRepository.getRoomMemberConnection(
            socketId,
            roomId
        );

        return Object.keys(members).length < room.maxParticipants;
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
