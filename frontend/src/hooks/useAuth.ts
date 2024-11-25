import useAuthStore from "@stores/useAuthStore.ts";

const useAuth = () => {
  const { isLoggedIn, nickname, login, logout, setNickname } = useAuthStore();

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

  return { isLoggedIn, nickname, logIn, logOut, setNickname };
};

export default useAuth;
