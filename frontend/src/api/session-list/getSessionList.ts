import { api } from "@/api/config/axios.ts";
import { Session } from "@/pages/SessionListPage/types/session";

export const getSessionList = async (): Promise<Session[]> => {
  const response = await api.get("api/rooms");
  return response.data;
};
