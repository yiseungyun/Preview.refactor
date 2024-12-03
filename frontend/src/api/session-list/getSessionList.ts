import { api } from "@/api/config/axios.ts";
import { Session } from "@/pages/SessionListPage/types/session";

interface GetSessionListRequest {
  inProgress: 0 | 1;
}

export const getSessionList = async ({
  inProgress = 0,
}: GetSessionListRequest): Promise<Session[]> => {
  const response = await api.get("api/rooms", {
    params: {
      inProgress
    }
  });

  return response.data;
};
