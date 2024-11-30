import QuestionsPreviewCard from "@components/questions/QuestionsPreviewCard.tsx";
import type { QuestionList } from "@/pages/QuestionListPage/types/QuestionList.ts";

interface QuestionListProps {
  questionList?: QuestionList[];
}

const QuestionList = ({ questionList }: QuestionListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {questionList &&
        questionList.map((list) => (
          <QuestionsPreviewCard
            key={list.id}
            id={list.id}
            questionCount={list.questionCount ?? 0}
            category={list.categoryNames[0]}
            title={list.title}
            isStarred={list.isStarred}
            usage={list.usage}
          />
        ))}
    </div>
  );
};

export default QuestionList;
