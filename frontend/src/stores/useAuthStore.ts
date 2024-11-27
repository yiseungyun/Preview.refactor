import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  nickname: string;
  isGuest: boolean;
  login: () => void;
  logout: () => void;
  guestLogin: () => void;
  guestLogout: () => void;
  setNickname: (nickname: string) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      nickname: "",
      isGuest: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
      guestLogin: () => set({ isGuest: true }),
      guestLogout: () => set({ isGuest: false }),
      setNickname: (nickname: string) => set({ nickname }),
    }),
    {
      name: "authState",
    }
  )
);

export default useAuthStore;
