export type RoomStatus = "PUBLIC" | "PRIVATE";

export interface Room {
    title: string;
    status: RoomStatus;
    maxParticipants: number;
    createdAt: number;
    host: string;
    questionListId;
}

export interface MemberConnection {
    joinTime: number;
    isHost: boolean;
    nickname: string;
}
