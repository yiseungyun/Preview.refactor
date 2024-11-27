import { Connection, RoomStatus } from "@/room/room.entity";

export interface RoomDto {
    id: string;
    title: string;
    category: string[];
    inProgress: boolean;
    host: Connection;
    status: RoomStatus;
    participants: number;
    maxParticipants: number;
    createdAt: number;
    connectionMap: Record<string, Connection>;
}
