import { Connection, RoomStatus } from "@/room/domain/room";

export class RoomListResponseDto {
    createdAt: number;
    host: Connection;
    maxParticipants: number;
    status: RoomStatus;
    title: string;
    id: string;
    category: string[];
    inProgress: boolean;
    questionListTitle: string;
    participants: number;
}
