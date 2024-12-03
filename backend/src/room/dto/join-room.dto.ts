import { IsNotEmpty } from "class-validator";
import { Question } from "@/question-list/entity/question.entity";
import { Connection, RoomStatus } from "@/room/domain/room";

export class JoinRoomDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    nickname: string;
}

export interface JoinRoomResponseDto {
    category: string[];
    inProgress: boolean;
    connectionMap: Record<string, Connection>;
    createdAt: number;
    currentIndex: number;
    maxQuestionListLength: number;
    questionListId: number;
    host: Connection;
    participants: number;
    maxParticipants: number;
    status: RoomStatus;
    title: string;
    id: string;
    questionListContents: Question[];
}
