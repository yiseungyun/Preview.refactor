import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;
  login: () => void;
  logout: () => void;
  setNickname: (nickname: string) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      nickname: "",
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
      setNickname: (nickname: string) => set({ nickname }),
    }),
    {
      name: "authState",
    }
  )
);

export default useAuthStore;
