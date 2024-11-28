import { IsNotEmpty } from "class-validator";

export class RoomIdDto {
    @IsNotEmpty()
    roomId: string;
}
