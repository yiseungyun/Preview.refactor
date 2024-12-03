import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { useQuestionList } from "@hooks/api/useGetQuestionList.ts";
import ErrorBlock from "@components/common/Error/ErrorBlock.tsx";
import QuestionsPreviewList from "@/pages/QuestionListPage/view/QuestionsPreviewList.tsx";
import useCategory from "@/pages/QuestionListPage/hooks/useCategory.ts";
import Pagination from "@components/common/Pagination";
import { useState } from "react";
import SidebarPageLayout from "@components/layout/SidebarPageLayout.tsx";
import QuestionListHeader from "@/pages/QuestionListPage/view/QuestionListHeader.tsx";

type Tab = "ALL" | "SCRAP";

const QuestionListPage = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<Tab>("ALL");
  const {
    data,
    error,
    isLoading: questionLoading,
  } = useQuestionList({
    category: selectedCategory,
    page: page,
    limit: 12,
    tab,
  });

  return (
    <SidebarPageLayout>
      <div className="max-w-6xl flex flex-col w-full px-12 pt-20  h-full">
        <QuestionListHeader
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          tab={tab}
          setTab={setTab}
        />
        <div className={"flex flex-col justify-between flex-grow"}>
          <LoadingIndicator loadingState={questionLoading} />
          <QuestionsPreviewList
            questionList={data?.allQuestionLists ?? data?.questionList}
            questionLoading={questionLoading}
            tab={tab}
          />
          <div className={"mb-20 mt-10"}>
            <Pagination
              currentPage={page}
              totalPage={data?.meta.totalPages || 0}
              onPageChange={setPage}
            />
          </div>
          <ErrorBlock
            error={error}
            message={"질문지 목록을 불러오는데 실패했습니다!"}
          />
        </div>
      </div>
    </SidebarPageLayout>
  );
};

export default QuestionListPage;
