import { api } from "@/api/config/axios";

interface EditMyInfoRequest {
  nickname?: string;
  avatarUrl?: string;
  password?: {
    original: string;
    newPassword: string;
  };
}

export const editMyInfo = async ({
  nickname,
  avatarUrl,
  password,
}: EditMyInfoRequest) => {
  const response = await api.patch("/api/user/my", {
    nickname,
    avatarUrl,
    password,
  });

  return response.data;
};
