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
    roomId: string;

    @Field({ type: "string" })
    title: string;

    @Field({ type: "string" })
    status: RoomStatus;

    @Field({ type: "number" })
    maxParticipants: number;

    @Field({ type: "number", sortable: true })
    createdAt: number;

    @Field({ type: "string" })
    host: string;

    @Field({ type: "string" })
    connectionList: string;
}
