import useAuthStore from "@stores/useAuthStore.ts";

const useAuth = () => {
  const { isLoggedIn, nickname, login, logout, setNickname } = useAuthStore();

  const logIn = () => {
    login();
  };

  const logOut = () => {
    logout();
  };

  return { isLoggedIn, nickname, logIn, logOut, setNickname };
};

export default useAuth;
