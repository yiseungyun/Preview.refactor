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
import { RoomStatus } from "@/room/room.entity";

export class CreateRoomDto {
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
    @ArrayMaxSize(3)
    @ArrayMinSize(1)
    category: string[];

    @IsNumber()
    @Min(1)
    @Max(5)
    maxParticipants: number;

    @IsNumber()
    questionListId: number;
}

export class CreateRoomInternalDto {
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
    @ArrayMaxSize(3)
    @ArrayMinSize(1)
    category: string[];

    @IsNotEmpty()
    socketId: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    maxParticipants: number;

    @IsNumber()
    questionListId: number;
}
