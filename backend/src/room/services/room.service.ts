import { Injectable } from "@nestjs/common";
import { RoomStatus } from "@/room/room.entity";
import { RoomRepository } from "@/room/room.repository";
import { RoomListResponseDto } from "@/room/dto/room-list.dto";

@Injectable()
export class RoomService {
    public constructor(private readonly roomRepository: RoomRepository) {}

    public async getPublicRoom(): Promise<RoomListResponseDto> {
        const rooms = await this.roomRepository.getAllRoom();
        return rooms
            .filter((room) => room.status === RoomStatus.PUBLIC)
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((room) => ({
                createdAt: room.createdAt,
                host: room.host,
                maxParticipants: room.maxParticipants,
                status: room.status,
                title: room.title,
                id: room.id,
                category: room.category,
                inProgress: room.inProgress,
                questionListTitle: room.questionListTitle,
                participants: room.participants,
            }));
    }

    public async setProgress(roomId: string, socketId: string, status: boolean) {
        const room = await this.roomRepository.getRoom(roomId);

        if (!room) throw new Error("cannot set progress");
        if (room.host.socketId !== socketId) throw new Error("only host can set process");

        room.inProgress = status;
        if (!room.inProgress) room.currentIndex = 0;
        await this.roomRepository.setRoom(room);
        return status;
    }

    public async setIndex(roomId: string, socketId: string, index: number) {
        const room = await this.roomRepository.getRoom(roomId);

        // TODO : 리팩토링 할 필요가 있어보임.
        if (
            !room ||
            !room.inProgress ||
            room.host.socketId !== socketId ||
            index < 0 ||
            index >= room.maxQuestionListLength
        )
            return -1;

        room.currentIndex = index;
        await this.roomRepository.setRoom(room);
        return index;
    }

    public async getIndex(roomId: string) {
        return (await this.roomRepository.getRoom(roomId)).currentIndex;
    }

    public async increaseIndex(roomId: string, socketId: string) {
        const room = await this.roomRepository.getRoom(roomId);

        if (!room || room.host.socketId !== socketId || !room.inProgress) return -1;

        const index = await this.setIndex(roomId, socketId, (await this.getIndex(roomId)) + 1);

        if (index === -1) return room.maxQuestionListLength - 1;

        return index;
    }

    public async finishRoom(roomId: string) {
        await this.roomRepository.removeRoom(roomId);
        return roomId;
    }
}
