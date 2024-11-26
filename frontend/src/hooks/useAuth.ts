import useAuthStore from "@stores/useAuthStore.ts";
import axios from "axios";
import { useEffect } from "react";

const useAuth = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { nickname, login, logout, setNickname } = useAuthStore();

  const getUserInfo = async () => {
    try {
      const response = await axios.get("/api/auth/whoami");

      if (response.data.username) {
        setNickname(response.data.username);
        return response.data.username;
      }
      return null;
    } catch (error) {
      console.error("유저 정보 불러오기 실패", error);
      return null;
    }
  };

  useEffect(() => {
    if (isLoggedIn && !nickname) {
      getUserInfo();
    }
  }, [isLoggedIn, nickname]);

  const logIn = () => {
    login();
  };

  const logOut = () => {
    logout();
  };

  return { isLoggedIn, nickname, logIn, logOut, setNickname };
};

export default useAuth;
