import SearchBar from "@/components/common/Input/SearchBar";
import CategorySelect from "@/components/common/Select/CategorySelect";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { IoMdAdd } from "react-icons/io";
import CreateButton from "@/components/common/Button/CreateButton";
import { options } from "@/constants/CategoryData.ts";
import { useQuestionList } from "@hooks/api/useGetQuestionList.ts";
import ErrorBlock from "@components/common/Error/ErrorBlock.tsx";
import QuestionsPreviewList from "@/pages/QuestionListPage/view/QuestionsPreviewList.tsx";
import useCategory from "@/pages/QuestionListPage/hooks/useCategory.ts";
import Pagination from "@components/common/Pagination";
import { useState } from "react";
import SidebarPageLayout from "@components/layout/SidebarPageLayout.tsx";

const QuestionListPage = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [page, setPage] = useState(1);
  const {
    data,
    error,
    isLoading: questionLoading,
  } = useQuestionList({ category: selectedCategory, page: page, limit: 12 });

  return (
    <SidebarPageLayout>
      <div className="max-w-6xl flex flex-col w-full px-12 pt-20  h-full">
        <div className="mb-12">
          <h1 className="text-bold-l text-gray-black dark:text-white mb-6">
            질문지 리스트
          </h1>
          <div className="h-11 flex gap-2 items-stretch justify-between">
            <SearchBar text={"질문지 검색하기"} />
            <CategorySelect
              value={selectedCategory}
              setValue={setSelectedCategory}
              options={options}
            />
            <CreateButton
              path={"/questions/create"}
              text={"새로운 질문지"}
              icon={IoMdAdd}
            />
          </div>
        </div>
        <div className={"flex flex-col justify-between flex-grow"}>
          <LoadingIndicator loadingState={questionLoading} />
          <QuestionsPreviewList
            questionList={data?.allQuestionLists}
            questionLoading={questionLoading}
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
