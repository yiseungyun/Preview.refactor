import { useQuestionList } from "@hooks/api/useGetQuestionList.ts";
import QuestionsList from "./QuestionsList.tsx";
import useCategory from "./hooks/useCategory.ts";
import Pagination from "@components/common/Pagination";
import { useState } from "react";
import SidebarPageLayout from "@components/layout/SidebarPageLayout.tsx";
import QuestionListHeader from "./QuestionListHeader.tsx";

type Tab = "ALL" | "SCRAP";

const QuestionListPage = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<Tab>("ALL");
  const { data } = useQuestionList({
    category: selectedCategory,
    page: page,
    limit: 12,
    tab,
  });

  const questionList = tab === "ALL" ? data.allQuestionLists || [] : data.questionList || [];

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
          <QuestionsList
            questionList={questionList}
            tab={tab}
          />
          <div className={"mb-20 mt-10"}>
            <Pagination
              currentPage={page}
              totalPage={data?.meta.totalPages || 0}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </SidebarPageLayout>
  );
};

export default QuestionListPage;
