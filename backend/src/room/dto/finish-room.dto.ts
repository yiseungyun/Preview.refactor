import { IsNotEmpty } from "class-validator";

export class FinishRoomDto {
    @IsNotEmpty()
    roomId: string;
}
