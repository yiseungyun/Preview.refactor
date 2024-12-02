import { api } from "@/api/config/axios.ts";

export const getMyInfo = async () => {
  const response = await api.get("/api/user/my");

  return response.data;
};
