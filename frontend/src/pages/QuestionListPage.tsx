import Sidebar from "@components/common/Sidebar.tsx";
import SearchBar from "@components/common/SearchBar.tsx";
import QuestionsPreviewCard from "@components/questions/QuestionsPreviewCard.tsx";
import Select from "@components/common/Select.tsx";
import useToast from "@hooks/useToast.ts";
import { useEffect, useState } from "react";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import useAuth from "@hooks/useAuth.ts";
import CreateButton from "@components/common/CreateButton.tsx";
import { options } from "@/constants/CategoryData.ts";

interface QuestionList {
  id: number;
  title: string;
  usage: number;
  isStarred?: boolean;
  questionCount: number;
  categoryNames: string[];
}

const QuestionList = () => {
  const toast = useToast();
  // 더미 데이터
  const [questionList, setQuestionList] = useState<QuestionList[]>([]);
  const [questionLoading, setQuestionLoading] = useState(true);
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getQuestionList(selectedCategory);
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

  const getQuestionList = async (category?: string) => {
    try {
      const response =
        category !== "전체"
          ? await axios.post(`/api/question-list/category`, {
              categoryName: category,
            })
          : await axios.get("/api/question-list");
      const data = response.data.data.allQuestionLists ?? [];
      setQuestionList(data);
      setQuestionLoading(false);
    } catch (error) {
      console.error("질문지 리스트 불러오기 실패", error);
      setQuestionList([]);
    }
  };

  const handleNavigateDetail = (id: number) => {
    navigate(`/questions/${id}`);
  };

  const handleNavigateCreate = () => {
    if (isLoggedIn) {
      navigate("/questions/create");
    } else {
      toast.error("로그인이 필요한 기능입니다.");
    }
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
              onClick={handleNavigateCreate}
              text={"새로운 질문지"}
              icon={IoMdAdd}
            />
          </div>
        </div>
        <LoadingIndicator loadingState={questionLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {questionList.map((list) => (
            <QuestionsPreviewCard
              key={list.id}
              id={list.id}
              questionCount={list.questionCount ?? 0}
              category={list.categoryNames[0]}
              title={list.title}
              isStarred={list.isStarred}
              usage={list.usage}
              onClick={() => handleNavigateDetail(list.id)}
            />
          ))}
        </div>
        {!questionLoading && questionList.length === 0 && (
          <div className={"p-2 text-xl text-gray-500"}>
            이런! 아직 질문지가 없습니다! 처음으로 생성해보시는 것은 어떤가요?
            ☃️
          </div>
        )}
      </div>
    </section>
  );
};

export default QuestionList;
