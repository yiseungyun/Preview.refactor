import { Injectable } from "@nestjs/common";
import { RoomStatus } from "@/room/room.entity";
import { RoomRepository } from "@/room/room.repository";

@Injectable()
export class RoomService {
    public constructor(private readonly roomRepository: RoomRepository) {}

    public async getPublicRoom() {
        const rooms = await this.roomRepository.getAllRoom();
        return rooms
            .filter((room) => room.status === RoomStatus.PUBLIC)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    public async finishRoom(roomId: string) {
        await this.roomRepository.removeRoom(roomId);
        return roomId;
    }
}
