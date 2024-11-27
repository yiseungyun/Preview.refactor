import SidebarPageLayout from "@components/layout/SidebarPageLayout";
import PageTitle from "@components/common/PageTitle";
import ProfileEditModal from "@/pages/MyPage/view/ProfileEditModal";
import Profile from "@/pages/MyPage/view/Profile";
import QuestionSection from "@/pages/MyPage/view/QuestionSection";

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
    </SidebarPageLayout>
  );
};

export default MyPageView;
