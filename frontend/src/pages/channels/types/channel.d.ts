export interface Channel {
  id: string;
  title: string;
  category?: string[];
  inProgress: boolean;
  host: {
    nickname?: string;
    socketId: string;
  };
  questionListTitle?: string;
  questionListId?: number;
  participants: number; // 현재 참여자
  maxParticipants: number;
  createdAt: number;
}
