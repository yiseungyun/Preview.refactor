import useAuthStore from "@stores/useAuthStore.ts";

const useAuth = () => {
  const {
    isLoggedIn,
    nickname,
    login,
    logout,
    setNickname,
    isGuest,
    guestLogin,
    guestLogout,
  } = useAuthStore();

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
