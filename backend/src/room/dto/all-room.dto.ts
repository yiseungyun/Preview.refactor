// DTO 클래스 정의
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { Connection, RoomStatus } from "@/room/domain/room";

export class AllRoomQueryParamDto {
    @IsOptional()
    @Transform(({ value }) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
    })
    @IsBoolean()
    inProgress: boolean;
}

export class RoomListResponseDto {
    createdAt: number;
    host: Connection;
    maxParticipants: number;
    status: RoomStatus;
    title: string;
    id: string;
    category: string[];
    inProgress: boolean;
    questionListTitle: string;
    participants: number;
}
