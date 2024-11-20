import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToast from "@hooks/useToast.ts";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      sendCodeToServer(code);
    } else {
      console.error("Code not found");
      toast.error("로그인에 실패했습니다.");
      navigate("/login");
    }
  }, []);

  const sendCodeToServer = async (code: string) => {
    try {
      const response = await axios.post("/api/auth/github", {
        code: code,
      });
      if (response.data) {
        toast.success("로그인에 성공했습니다.");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to sending auth code to server", error);
      toast.error("로그인에 실패했습니다.");
      navigate("/login");
    }
  };

  return (
    <section className={"h-screen flex justify-center items-center"}>
      <LoadingIndicator loadingState={true} text={"Authenticating..."} />
    </section>
  );
};
export default AuthCallbackPage;
