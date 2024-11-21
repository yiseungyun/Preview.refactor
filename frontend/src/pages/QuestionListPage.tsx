import Sidebar from "@components/common/Sidebar.tsx";
import SearchBar from "@components/common/SearchBar.tsx";
import QuestionsPreviewCard from "@components/questions/QuestionsPreviewCard.tsx";
import Select from "@components/common/Select.tsx";
import useToast from "@hooks/useToast.ts";
import { useEffect, useState } from "react";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.ts";

interface Question {
  id: number;
  title: string;
  questionCount: number;
  usage: number;
  isStarred: boolean;
  category: string;
}

const QuestionList = () => {
  const toast = useToast();
  // 더미 데이터
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [questionLoading, setQuestionLoading] = useState(true);
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const questionLists = [
      {
        id: 1,
        title: "프론트엔드 기술 면접",
        questionCount: 25,
        usage: 128,
        isStarred: true,
        category: "Frontend",
      },
      {
        id: 2,
        title: "React 심화 면접 질문",
        questionCount: 30,
        usage: 89,
        isStarred: false,
        category: "React",
      },
      {
        id: 3,
        title: "JavaScript 핵심 개념",
        questionCount: 40,
        usage: 156,
        isStarred: true,
        category: "JavaScript",
      },
      {
        id: 4,
        title: "웹 성능 최적화",
        questionCount: 20,
        usage: 67,
        isStarred: false,
        category: "Performance",
      },
      {
        id: 5,
        title: "CSS 레이아웃 마스터",
        questionCount: 15,
        usage: 45,
        isStarred: false,
        category: "CSS",
      },
      {
        id: 6,
        title: "웹 접근성과 SEO",
        questionCount: 35,
        usage: 92,
        isStarred: true,
        category: "Accessibility",
      },
    ];

    const timeout = setTimeout(() => {
      setQuestionList(questionLists);
      setQuestionLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const handleNavigateDetail = (id: number) => {
    toast.error(`질문지 아이디${id} 페이지는 준비중인 기능입니다.`);
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
      <div className="max-w-7xl w-full px-12 pt-20">
        <div className="mb-12">
          <h1 className="text-bold-l text-gray-black dark:text-white mb-6">
            질문지 목록
          </h1>
          <div className="flex gap-2 items-stretch justify-between">
            <SearchBar text={"질문지 검색하기"} />
            <Select
              options={[
                { label: "FE", value: "FE" },
                { label: "BE", value: "BE" },
                { label: "CS", value: "CS" },
              ]}
            />
            <button
              className={
                "flex justify-center items-center fill-current min-w-11 min-h-11 bg-green-200 rounded-custom-m box-border"
              }
              onClick={handleNavigateCreate}
            >
              <IoMdAdd className="w-[1.35rem] h-[1.35rem] text-gray-white" />
            </button>
          </div>
        </div>
        <LoadingIndicator loadingState={questionLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {questionList.map((list) => (
            <QuestionsPreviewCard
              key={list.id}
              id={list.id}
              questionCount={list.questionCount}
              category={list.category}
              title={list.title}
              isStarred={list.isStarred}
              usage={list.usage}
              onClick={() => handleNavigateDetail(list.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuestionList;
