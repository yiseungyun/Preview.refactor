import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import useToast from "@hooks/useToast";
import MyPageView from "./MyPageView";

const MyPage = () => {
  const { isLoggedIn, nickname } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate, toast]);

  return <MyPageView nickname={nickname} />;
};

export default MyPage;
