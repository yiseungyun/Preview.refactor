import { create } from "zustand";
import { getMyInfo } from "@/api/user/getMyInfo";
import { editMyInfo } from "@/api/user/editMyInfo";

interface EditData {
  nickname?: string;
  avatarUrl?: string;
  password?: {
    original: string;
    newPassword: string;
  };
}

interface UserData {
  userId: string;
  loginType: "github" | "native";
  nickname: string;
  avatarUrl: string;
}

interface UserState {
  user: UserData | null;
  isLoading: boolean;
  error: Error | null;

  initStore: () => Promise<void>;
  getMyInfo: () => Promise<void>;
  editMyInfo: (userData: Partial<EditData>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  initStore: async () => {
    await get().getMyInfo();
  },

  getMyInfo: async () => {
    set({ isLoading: true });
    try {
      const userData = await getMyInfo();
      set({ user: userData, error: null });
    } catch (err) {
      set({ error: err as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  editMyInfo: async (userData) => {
    set({ isLoading: true });
    try {
      const updatedUser = await editMyInfo(userData);
      const currentUser = get().user;

      set({
        user: currentUser
          ? {
              ...currentUser,
              nickname: updatedUser.nickname,
              avatarUrl: updatedUser.avartarUrl,
            }
          : null,
        error: null,
      });
    } catch (err) {
      set({ error: err as Error });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
