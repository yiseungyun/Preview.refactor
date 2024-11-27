import { sectionWithSidebar } from "@/constants/LayoutConstant.ts";
import { useEffect } from "react";
import useAuth from "@hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import useToast from "@hooks/useToast.ts";
import Sidebar from "@components/common/Sidebar.tsx";
import Profile from "@components/mypage/Profile";
import QuestionSection from "@/components/mypage/QuestionSection";
import ProfileEditModal from "@/components/mypage/ProfileEditModal";

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

  return (
    <section className={sectionWithSidebar}>
      <Sidebar />
      <div
        className={
          "flex flex-col max-w-7xl px-12 pt-20 pb-8 overflow-auto no-scrollbar"
        }
      >
        <h1 className={"text-bold-l mb-6 text-gray-black dark:text-white"}>
          마이페이지
        </h1>
        <div
          className={
            "flex flex-col gap-8 w-47.5 px-8 pt-8 pb-6 bg-white shadow-8 rounded-custom-l"
          }
        >
          <ProfileEditModal />
          <Profile nickname={nickname} />
          <QuestionSection />
        </div>
      </div>
    </section>
  );
};

export default MyPage;
