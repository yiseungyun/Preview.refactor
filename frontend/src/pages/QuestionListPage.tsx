import { FaPlus } from "react-icons/fa6";
import Sidebar from "@components/common/Sidebar.tsx";
import SearchBar from "@components/common/SearchBar.tsx";
import QuestionsPreviewCard from "@components/questions/QuestionsPreviewCard.tsx";
import Select from "@components/common/Select.tsx";
import useToast from "@hooks/useToast.ts";

const QuestionList = () => {
  const toast = useToast();
  // 더미 데이터
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

  const handleNavigateDetail = (id: number) => {
    toast.error(`질문지 아이디${id} 페이지는 준비중인 기능입니다.`);
  };

  return (
    <section className="flex w-screen min-h-screen ">
      <Sidebar />
      <div className="max-w-7xl w-full mx-auto p-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white my-4">
            질문지 목록
          </h1>
          <div className="flex gap-4 items-stretch justify-between">
            <SearchBar text={"질문지 검색하기"} />
            <Select
              options={[
                { label: "FE", value: "FE" },
                { label: "BE", value: "BE" },
                { label: "CS", value: "CS" },
              ]}
            />
            <button className="flex items-center gap-2 px-4 py-3 bg-green-200 text-white rounded-lg hover:bg-emerald-500 transition-colors">
              <FaPlus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
          {questionLists.map((list) => (
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
