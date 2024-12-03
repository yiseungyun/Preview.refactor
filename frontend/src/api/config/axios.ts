import axios, { AxiosError } from "axios";
import { refreshAccessToken } from "@/api/user/auth.ts";
import useAuthStore from "@stores/useAuthStore.ts";

export const api = axios.create({
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      try {
        const response = await refreshAccessToken();
        console.log(response);
        if (response.data.success) {
          return axios(originalRequest!);
        }
      } catch (error) {
        console.log("토큰 재발급 실패", error);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        useAuthStore.persist.clearStorage();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
