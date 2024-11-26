import { IsNotEmpty } from "class-validator";

export class ReactionDto {
    @IsNotEmpty()
    socketId: string;

    @IsNotEmpty()
    reactionType: string;
}
