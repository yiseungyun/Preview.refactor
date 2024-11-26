import { RoomStatus } from "@/room/room.entity";

export interface Connection {
    socketId: string;
    createAt: number;
    nickname: string;
}

export interface RoomDto {
    roomId: string;
    title: string;
    status: RoomStatus;
    maxParticipants: number;
    createdAt: number;
    host: string;
    connectionList: Connection[];
}
