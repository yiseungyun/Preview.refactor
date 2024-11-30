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
    const randomNickname = createGuestRandomNickname();
    setNickname(randomNickname);
    guestLogin();
    return randomNickname;
  };

  const firstNames = [
    "신나는",
    "즐거운",
    "행복한",
    "멋있는",
    "귀여운",
    "활기찬",
    "열정적인",
    "용감한",
    "영리한",
    "현명한",
    "따뜻한",
    "차가운",
  ];

  const secondNames = [
    "판다",
    "고양이",
    "강아지",
    "토끼",
    "사자",
    "기린",
    "코끼리",
    "하마",
    "펭귄",
    "여우",
    "눈사람",
  ];

  const createGuestRandomNickname = () => {
    // 각 배열에서 랜덤한 인덱스 선택
    const randomFirstIndex = Math.floor(Math.random() * firstNames.length);
    const randomSecondIndex = Math.floor(Math.random() * secondNames.length);

    // 선택된 단어들을 조합
    return `${firstNames[randomFirstIndex]} ${secondNames[randomSecondIndex]}${Math.floor(Math.random() * 1000)}`;
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
