export type RoomStatus = "PUBLIC" | "PRIVATE";

export interface Room {
    title: string;
    status: RoomStatus;
    createdAt: number;
    members: string[];
    host: string;
}

export interface MemberConnection {
    joinTime: number;
    isHost: boolean;
    nickname: string;
}
