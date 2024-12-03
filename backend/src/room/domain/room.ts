import { RoomEntity } from "@/room/room.entity";

export interface Connection {
    socketId: string;
    nickname: string;
    createAt: number;
}

export enum RoomStatus {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

export interface IRoom {
    id: string;
    title: string;
    category: string[];
    inProgress: boolean;
    currentIndex: number;
    host: Connection;
    status: RoomStatus;
    maxParticipants: number;
    maxQuestionListLength: number;
    questionListId: number;
    questionListTitle: string;
    createdAt: number;
    connectionMap: Record<string, Connection>;
}

export class Room {
    public entity: RoomEntity;

    constructor(entity?: IRoom) {
        if (!entity) {
            this.entity = null;
            return this;
        }
        this.entity = new RoomEntity();
        this.entity.id = entity.id;
        this.entity.status = entity.status;
        this.setConnection(entity.connectionMap);
        this.entity.title = entity.title;
        this.entity.createdAt = entity.createdAt;
        this.entity.questionListId = entity.questionListId;
        this.entity.questionListTitle = entity.questionListTitle;
        this.entity.inProgress = entity.inProgress;
        this.entity.maxParticipants = entity.maxParticipants;
        this.entity.currentIndex = entity.currentIndex;
        this.entity.category = entity.category;
        this.entity.maxQuestionListLength = entity.maxQuestionListLength;
        this.entity.host = JSON.stringify(entity.host);
    }

    static fromEntity(entity: RoomEntity) {
        const room = new Room();
        room.entity = entity;
        return room;
    }

    build() {
        return this.entity;
    }

    toObject(): IRoom {
        return {
            id: this.entity.id,
            status: this.entity.status,
            connectionMap: this.getConnection(),
            title: this.entity.title,
            createdAt: this.entity.createdAt,
            questionListId: this.entity.questionListId,
            questionListTitle: this.entity.questionListTitle,
            inProgress: this.entity.inProgress,
            maxParticipants: this.entity.maxParticipants,
            currentIndex: this.entity.currentIndex,
            category: this.entity.category,
            maxQuestionListLength: this.entity.maxQuestionListLength,
            host: this.getHost(),
        };
    }

    setHost(connection: Connection) {
        this.entity.host = JSON.stringify(connection);
        return this;
    }

    getHost(): Connection {
        return JSON.parse(this.entity.host);
    }

    setConnection(connectionMap: Record<string, Connection>) {
        this.entity.connectionMap = JSON.stringify(connectionMap);
        return this;
    }

    getConnection(): Record<string, Connection> {
        return JSON.parse(this.entity.connectionMap);
    }

    getParticipants(): number {
        return Object.keys(this.getConnection()).length;
    }

    addConnection(connection: Connection) {
        const connectionMap = this.getConnection();
        connectionMap[connection.socketId] = connection;
        return this.setConnection(connectionMap);
    }

    removeConnection(socketId: string) {
        const connectionMap = this.getConnection();
        delete connectionMap[socketId];
        return this.setConnection(connectionMap);
    }
}
