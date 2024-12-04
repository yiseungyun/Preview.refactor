import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    Max,
    Min,
} from "class-validator";
import { Connection, RoomStatus } from "@/room/domain/room";
import { Question } from "@/question-list/entity/question.entity";

export class CreateRoomDto {
    private static MAX_CATEGORY_SIZE = 3;
    private static MIN_CATEGORY_SIZE = 1;
    private static MAX_PARTICIPANT_SIZE = 5;
    private static MIN_PARTICIPANT_SIZE = 1;
    @IsNotEmpty()
    title: string;

    @IsEnum(RoomStatus, {
        message: "Status must be either PUBLIC or PRIVATE",
    })
    status: RoomStatus;

    @IsNotEmpty()
    nickname: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMaxSize(CreateRoomDto.MAX_CATEGORY_SIZE)
    @ArrayMinSize(CreateRoomDto.MIN_CATEGORY_SIZE)
    category: string[];

    @IsNumber()
    @Min(CreateRoomDto.MIN_PARTICIPANT_SIZE)
    @Max(CreateRoomDto.MAX_PARTICIPANT_SIZE)
    maxParticipants: number;

    @IsNumber()
    questionListId: number;
}

export interface CreateRoomResponseDto {
    title: string;
    status: RoomStatus;
    nickname: string;
    maxParticipants: number;
    category: string[];
    questionListId: number;
    socketId: string;
    id: string;
    inProgress: boolean;
    connectionMap: Record<string, Connection>;
    participants: number;
    questionListContents: Question[];
    createdAt: number;
    host: Connection;
}
