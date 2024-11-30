import { Connection, RoomStatus } from "@/room/room.entity";
import { Max, Min } from "class-validator";

export class RoomList {
    createdAt: number;

    host: Connection;

    @Max(5)
    @Min(1)
    maxParticipants: number;

    status: RoomStatus;

    title: string;

    id: string;

    category: string[];

    inProgress: boolean;

    questionListTitle: string;

    @Max(5)
    @Min(1)
    participants: number;
}

export type RoomListResponseDto = RoomList[];
