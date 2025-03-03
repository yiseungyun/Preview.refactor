import QuestionsCard from "@/pages/questions/QuestionCard";
import type { QuestionList } from "./types/QuestionList";

interface QuestionListProps {
  questionList: QuestionList[];
  tab: "ALL" | "SCRAP";
}

const QuestionsList = ({
  questionList
}: QuestionListProps) => {
  if (questionList.length === 0) {
    return <div className="text-center mt-12 text-medium-l text-gray-500">스크랩한 질문지가 없습니다.</div>;
  }

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
      {questionList.map((list) => (
        <QuestionsCard
          key={list.id}
          id={list.id}
          questionCount={list.questionCount ?? 0}
          category={list.categoryNames ? list.categoryNames[0] : "미분류"}
          title={list.title}
          usage={list.usage}
        />
      ))}
    </div>
  );
};

export default QuestionsList;
