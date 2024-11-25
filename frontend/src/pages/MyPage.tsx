import { sectionWithSidebar } from "@/constraints/LayoutConstant.ts";
import { useEffect, useState } from "react";
import useAuth from "@hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import useToast from "@hooks/useToast.ts";
import Sidebar from "@components/common/Sidebar.tsx";
import axios from "axios";
import Profile from "@components/mypage/Profile";
import QuestionList from "@components/mypage/QuestionList";

export interface UserInfo {
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
      navigate("/login");
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
      <div className={"flex flex-col max-w-7xl px-12 pt-20"}>
        <h1 className={"text-bold-l mb-6"}>마이페이지</h1>
        <div
          className={"flex flex-col gap-8 w-47.5 p-8 bg-white shadow-8 rounded-custom-l"}
        >
          <Profile userInfo={userInfo} />
          <QuestionList />
        </div>
      </div>
    </section>
  );
};

export default MyPage;
