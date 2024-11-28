import useAuthStore from "@stores/useAuthStore";
import axios from "axios";
import { useEffect } from "react";

const useAuth = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const {
    nickname,
    login,
    logout,
    setNickname,
    isGuest,
    guestLogin,
    guestLogout,
  } = useAuthStore();

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
    setNickname("");

    useAuthStore.persist.clearStorage();
    document.cookie = "accessToken=; Max-Age=0; path=/;";
    document.cookie = "refreshToken=; Max-Age=0; path=/;";
  };

  const guestLogIn = () => {
    setNickname("게스트 사용자");
    guestLogin();
  };

  return {
    isLoggedIn,
    nickname,
    logIn,
    logOut,
    setNickname,
    isGuest,
    guestLogIn,
    guestLogout,
  };
};

export default useAuth;
