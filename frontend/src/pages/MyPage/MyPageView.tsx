import SidebarPageLayout from "@components/layout/SidebarPageLayout";
import PageTitle from "@components/common/PageTitle";
import ProfileEditModal from "@components/mypage/ProfileEditModal";
import Profile from "@components/mypage/Profile";
import QuestionSection from "@components/mypage/QuestionSection";

interface MyPageViewProps {
  nickname: string;
}

const MyPageView = ({ nickname }: MyPageViewProps) => {
  return (
    <SidebarPageLayout childrenClassName="flex flex-col flex-shrink-0 w-7xl px-12 pt-20 pb-8 overflow-auto no-scrollbar">
      <PageTitle title="마이페이지" />
      <div className="flex flex-col gap-8 w-5xl px-8 pt-8 pb-6 bg-white shadow-8 rounded-custom-l">
        <ProfileEditModal />
        <Profile nickname={nickname} />
        <QuestionSection />
      </div>
    </SidebarPageLayout >
  );
};

export default MyPageView;