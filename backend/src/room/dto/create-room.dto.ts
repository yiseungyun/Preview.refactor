export interface CreateRoomDto {
    title: string;
    status: "PUBLIC" | "PRIVATE";
    nickname: string;
    socketId: string;
    maxParticipants?: number;
    questionListId: number;
}
