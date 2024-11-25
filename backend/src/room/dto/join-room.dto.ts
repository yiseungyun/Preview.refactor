import { IsNotEmpty } from "class-validator";

export class JoinRoomDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    nickname: string;
}

export class JoinRoomInternalDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    socketId: string;

    @IsNotEmpty()
    nickname: string;
}
