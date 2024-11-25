import { sectionWithSidebar } from "@/constraints/LayoutConstant.ts";
import { useEffect, useState } from "react";
import useAuth from "@hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import useToast from "@hooks/useToast.ts";
import Sidebar from "@components/common/Sidebar.tsx";
import axios from "axios";

interface UserInfo {
  nickname: string;
}

const MyPage = () => {
  const { isLoggedIn, nickname } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const auth = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요한 서비스입니다.");

      navigate("/login", { replace: true });
    } else {
      if (auth.nickname) {
        setUserInfo({ nickname: auth.nickname });
      } else {
        getUserInfo();
      }
      setUserInfo({ nickname });
    }
  }, [isLoggedIn]);

  const getUserInfo = async () => {
    try {
      const response = await axios.get("/api/auth/whoami");

      if (response.data.username) {
        auth.setNickname(response.data.username);
        setUserInfo({ nickname: response.data.username });
      }
    } catch (error) {
      console.error("유저 정보 불러오기 실패", error);
    }
  };

  return (
    <section className={sectionWithSidebar}>
      <Sidebar />
      <div className={"p-20"}>
        <h1 className={"text-4xl "}>My Page</h1>
        <p>유저 정보: {userInfo && userInfo.nickname}</p>
      </div>
    </section>
  );
};

export default MyPage;
