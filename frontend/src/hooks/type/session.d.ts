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

export interface PeerConnection {
  peerId: string; // 연결된 상대의 ID
  peerNickname: string; // 상대의 닉네임
  stream: MediaStream; // 상대방의 비디오/오디오 스트림
  isHost?: boolean; // 호스트 여부
  reaction?: string;
}