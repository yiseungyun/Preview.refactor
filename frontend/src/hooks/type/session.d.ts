export type RoomStatus = "PUBLIC" | "PRIVATE";

export interface RoomMetadata {
  title: string;
  status: RoomStatus;
  participants: number;
  maxParticipants: number;
  createdAt: number;
  inProgress: boolean;
  host: UserInfo;
  category: string | string[];
}

export interface RoomJoinResponse {
  category: string;
  inProgress: boolean;
  createdAt: number;
  host: UserInfo;
  participants: number;
  maxParticipants: number;
  status: "PUBLIC" | "PRIVATE";
  title: string;
  id: string;
  connectionList: UserInfo[];
}

export interface UserInfo {
  socketId: string;
  createdAt: number;
  nickname: string;
}

export interface ResponseMasterChanged {
  socketId: string;
  nickname: string;
}

export interface Participant {
  id?: string;
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
