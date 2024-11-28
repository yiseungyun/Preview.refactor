import { IsNotEmpty, IsNumber } from "class-validator";

export class MoveIndexDto {
    @IsNotEmpty()
    roomId: string;

    @IsNumber()
    index: number;
}
