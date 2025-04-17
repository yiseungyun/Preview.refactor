export type RoomStatus = "PUBLIC" | "PRIVATE";

export interface RoomBase {
  title: string;
  status: RoomStatus;
  participants: number;
  maxParticipants: number;
  createdAt: number;
  inProgress: boolean;
  host: UserInfo;
  questionListId: number;
  questionListContents: Question[];
  currentIndex: number;
}

export interface RoomMetadata extends RoomBase {
  category: string | string[];
}

export interface Question {
  id: number;
  content: string;
  index: number;
  questionListId: number;
}

export interface UserInfo {
  socketId: string;
  createdAt: number;
  nickname: string;
}

export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
}