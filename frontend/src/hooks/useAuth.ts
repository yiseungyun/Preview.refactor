import useAuthStore from "@stores/useAuthStore.ts";

const useAuth = () => {
  const { isLoggedIn, login, logout } = useAuthStore();

  const logIn = () => {
    login();
  };

  const logOut = () => {
    logout();
  };

  return { isLoggedIn, logIn, logOut };
};

export default useAuth;
