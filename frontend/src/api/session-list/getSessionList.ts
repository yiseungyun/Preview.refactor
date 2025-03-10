import { api } from "@/api/config/axios.ts";

interface GetSessionListRequest {
  inProgress: boolean;
}

interface Session {
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
  participants: number;
  maxParticipants: number;
  createdAt: number;
}

export const getSessionList = async ({
  inProgress = false,
}: GetSessionListRequest): Promise<Session[]> => {
  const response = await api.get("api/rooms", {
    params: { inProgress }
  });

  return response.data;
};
