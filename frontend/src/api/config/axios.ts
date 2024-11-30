import axios, { AxiosError } from "axios";
import useAuth from "@hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";

export const api = axios.create({
  timeout: 5000,
  withCredentials: true,
});

// 401에러일때의 처리
// 현재 서비스를 사용하다가 인증 에러가 난거니까 현재 서비스 url을 기록하고 로그인 후 복귀 하는 것을 목표
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const { logOut } = useAuth();
      const navigate = useNavigate();
      const currentPath = window.location.pathname;
      localStorage.setItem("redirectUrl", currentPath);

      // 로그아웃처리
      logOut();

      // 로그인 페이지로 리다이렉트
      navigate("/login", { replace: true });
    }
    return Promise.reject(error);
  }
);
