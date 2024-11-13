export interface CreateRoomDto {
    title: string;
    status: "PUBLIC" | "PRIVATE";
    socketId: string;
}
