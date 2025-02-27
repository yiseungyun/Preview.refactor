import SidebarPageLayout from "@/components/layout/SidebarPageLayout";
import PageTitle from "@/components/common/Text/PageTitle";
import ProfileEditModal from "./view/ProfileEditModal";
import Profile from "./view/Profile";
import QuestionSection from "./view/QuestionSection";
import useModal from "@/hooks/useModal";

const MyPage = () => {
  const modal = useModal();

  return (
    <SidebarPageLayout childrenClassName="flex flex-col flex-shrink-0 max-w-6xl w-6xl px-12 pt-20 pb-8 overflow-auto no-scrollbar">
      <PageTitle title="마이페이지" />
      <div className="flex flex-col gap-8 min-w-5xl w-5xl flex-shrink-0 px-8 pt-8 pb-6 bg-white shadow-8 rounded-custom-l">
        <ProfileEditModal modal={modal} />
        <Profile modal={modal} />
        <QuestionSection />
      </div>
    </SidebarPageLayout>
  );
};

export default MyPage;
