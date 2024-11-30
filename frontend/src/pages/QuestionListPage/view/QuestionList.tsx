import QuestionsPreviewCard from "@components/questions/QuestionsPreviewCard.tsx";
import type { QuestionList } from "@/pages/QuestionListPage/types/QuestionList.ts";

interface QuestionListProps {
  questionList?: QuestionList[];
  questionLoading?: boolean;
}

const QuestionList = ({ questionList, questionLoading }: QuestionListProps) => {
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

      {!questionLoading && questionList?.length === 0 && (
        <div className={"p-2 text-xl text-gray-500"}>
          이런! 아직 질문지가 없습니다! 처음으로 생성해보시는 것은 어떤가요? ☃️
        </div>
      )}
    </div>
  );
};

export default QuestionList;
