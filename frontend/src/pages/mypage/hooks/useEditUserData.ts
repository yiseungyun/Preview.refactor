import { editMyInfo } from "@/api/user/editMyInfo";
import useToast from "@/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UserData {
  userId: string;
  loginType: "github" | "native";
  nickname: string;
  avatarUrl: string;
}

interface EditData {
  nickname?: string;
  avatarUrl?: string;
  password?: {
    original: string;
    newPassword: string;
  };
}

export const useEditUserData = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (userData: Partial<EditData>) => editMyInfo(userData),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<UserData>(["user", "my"], (oldData) => {
        if (!oldData) return updatedUser;

        return {
          ...oldData,
          nickname: updatedUser.nickname ?? oldData.nickname,
          avatarUrl: updatedUser.avatarUrl ?? oldData.avatarUrl
        }
      })
    },
    onError: (error) => {
      console.error("프로필 업데이트 오류", error);
      toast.error("프로필 업데이트에 실패했습니다.");
    }
  });
};
