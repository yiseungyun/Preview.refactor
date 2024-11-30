import { Connection, RoomStatus } from "@/room/room.entity";

export interface RoomDto {
    id: string;
    title: string;
    category: string[];
    inProgress: boolean;
    currentIndex: number;
    host: Connection;
    status: RoomStatus;
    participants: number;
    maxParticipants: number;
    maxQuestionListLength: number;
    questionListId: number;
    questionListTitle: string;
    createdAt: number;
    connectionMap: Record<string, Connection>;
}
