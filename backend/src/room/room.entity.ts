import { Entity, Field, Schema } from "nestjs-redis-om";

export interface Connection {
    socketId: string;
    nickname: string;
    createAt: number;
}

export enum RoomStatus {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

@Schema("room", {})
export class RoomEntity extends Entity {
    @Field({ type: "string", indexed: true })
    id: string;

    @Field({ type: "string" })
    title: string;

    @Field({ type: "string[]" })
    category: string[];

    @Field({ type: "boolean" })
    inProgress: boolean;

    @Field({ type: "number" })
    currentIndex: number;

    @Field({ type: "string" })
    status: RoomStatus;

    @Field({ type: "number" })
    maxParticipants: number;

    @Field({ type: "number" })
    maxQuestionListLength: number;

    @Field({ type: "number", sortable: true })
    createdAt: number;

    // Connection
    @Field({ type: "string" })
    host: string;

    // Record<string, Connection>
    @Field({ type: "string" })
    connectionMap: string;
}
