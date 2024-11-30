import Sidebar from "@components/common/Sidebar.tsx";
import SearchBar from "@components/common/SearchBar.tsx";
import Select from "@components/common/Select.tsx";
import { useEffect, useState } from "react";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateButton from "@components/common/CreateButton.tsx";
import { options } from "@/constants/CategoryData.ts";
import { useQuestionList } from "@hooks/api/useGetQuestionList.ts";
import ErrorBlock from "@components/common/Error/ErrorBlock.tsx";
import QuestionList from "@/pages/QuestionListPage/view/QuestionList.tsx";

const QuestionListPage = () => {
  // const [questionList, setQuestionList] = useState<QuestionList[]>([]);
  // const [questionLoading, setQuestionLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: questionList,
    error,
    isLoading: questionLoading,
  } = useQuestionList({ category: selectedCategory });

  useEffect(() => {
    if (selectedCategory !== "전체") {
      console.log("selectedCategory", selectedCategory);
      setSearchParams({ category: selectedCategory });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category") ?? "전체");
    }
  }, [searchParams]);

  const handleNavigateDetail = (id: number) => {
    navigate(`/questions/${id}`);
  };

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

        <QuestionList questionList={questionList} />
        {!questionLoading && questionList?.length === 0 && (
          <div className={"p-2 text-xl text-gray-500"}>
            이런! 아직 질문지가 없습니다! 처음으로 생성해보시는 것은 어떤가요?
            ☃️
          </div>
        )}
        <ErrorBlock
          error={error}
          message={"질문지 목록을 불러오는데 실패했습니다!"}
        />
      </div>
    </section>
  );
};

export default QuestionListPage;
