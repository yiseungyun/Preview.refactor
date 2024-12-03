import { api } from "@/api/config/axios.ts";
import { Session } from "@/pages/SessionListPage/types/session";

interface GetSessionListRequest {
  inProgress: boolean;
}

export const getSessionList = async ({
  inProgress = false,
}: GetSessionListRequest): Promise<Session[]> => {
  const response = await api.get("api/rooms", {
    params: {
      inProgress
    }
  });

  return response.data;
};
