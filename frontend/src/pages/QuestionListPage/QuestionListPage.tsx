import Sidebar from "@components/common/Sidebar.tsx";
import SearchBar from "@components/common/SearchBar.tsx";
import Select from "@components/common/Select.tsx";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { IoMdAdd } from "react-icons/io";
import CreateButton from "@components/common/CreateButton.tsx";
import { options } from "@/constants/CategoryData.ts";
import { useQuestionList } from "@hooks/api/useGetQuestionList.ts";
import ErrorBlock from "@components/common/Error/ErrorBlock.tsx";
import QuestionsPreviewList from "@/pages/QuestionListPage/view/QuestionsPreviewList.tsx";
import useCategory from "@/pages/QuestionListPage/hooks/useCategory.ts";

const QuestionListPage = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const {
    data: questionList,
    error,
    isLoading: questionLoading,
  } = useQuestionList({ category: selectedCategory });

  return (
    <section className="flex w-screen min-h-screen">
      <Sidebar />
      <div className="max-w-5xl w-full px-12 pt-20">
        <div className="mb-12">
          <h1 className="text-bold-l text-gray-black dark:text-white mb-6">
            질문지 목록
          </h1>
          <div className="flex gap-2 items-stretch justify-between">
            <SearchBar text={"질문지 검색하기"} />
            <Select
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
        <LoadingIndicator loadingState={questionLoading} />
        <QuestionsPreviewList
          questionList={questionList}
          questionLoading={questionLoading}
        />
        <ErrorBlock
          error={error}
          message={"질문지 목록을 불러오는데 실패했습니다!"}
        />
      </div>
    </section>
  );
};

export default QuestionListPage;
