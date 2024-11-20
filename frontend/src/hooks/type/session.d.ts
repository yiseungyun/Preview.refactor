export type RoomStatus = "PUBLIC" | "PRIVATE";

export interface RoomMetadata {
  title: string;
  status: RoomStatus;
  maxParticipants: number;
  createdAt: number;
  host: string;
}

export interface AllUsersResponse {
  roomMetadata: RoomMetadata;
  users: {
    [socketId: string]: {
      joinTime: number;
      nickname: string;
      isHost: boolean;
    };
  };
}

export interface ResponseMasterChanged {
  masterNickname: string;
  masterSocketId: string;
}

export interface Participant {
  nickname: string;
  isHost: boolean;
}
