import { IsNotEmpty } from "class-validator";

export class ReactionDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    reactionType: string;
}
