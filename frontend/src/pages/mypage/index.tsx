import PageTitle from "@components/common/Text/PageTitle";
import ProfileEditModal from "./ProfileEditModal";
import Profile from "./Profile";
import useModal from "@hooks/useModal";
import { TabItem, TabList, TabPanel, TabProvider } from "@components/common/Tab";
import { Suspense } from "react";
import QuestionList from "./QuestionList";
import SkeletonQuestionList from "./SkeletonQuestionList";

const MyPage = () => {
  const modal = useModal();

  return (
    <div className="flex flex-col flex-shrink-0 max-w-6xl w-6xl px-12 pt-20 pb-8 overflow-auto no-scrollbar">
      <PageTitle title="마이페이지" />
      <div className="flex flex-col gap-8 min-w-5xl w-5xl flex-shrink-0 px-8 pt-8 pb-6 bg-white shadow-8 rounded-custom-l">
        {modal.isOpen && <ProfileEditModal modal={modal} />}
        <Profile modal={modal} />
        <TabProvider defaultTab="my" className="mt-4">
          <TabList>
            <TabItem id="my">나의 질문지</TabItem>
            <TabItem id="scrap">스크랩한 질문지</TabItem>
          </TabList>
          <TabPanel id="my" className="mt-8 h-full">
            <Suspense fallback={<SkeletonQuestionList />}>
              <QuestionList id="myList" />
            </Suspense>
          </TabPanel>
          <TabPanel id="scrap" className="mt-8 h-full">
            <Suspense fallback={<SkeletonQuestionList />}>
              <QuestionList id="savedList" />
            </Suspense>
          </TabPanel>
        </TabProvider>
      </div>
    </div>
  );
};

export default MyPage;
