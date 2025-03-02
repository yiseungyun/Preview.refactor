import { useGetQuestionContent } from "@/hooks/api/useGetQuestionContent";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ questionId }: { questionId: string }) => {
  const { data: question } = useGetQuestionContent(Number(questionId));

  if (!question) return null;

  return (
    <div className="flex flex-col gap-3">
      {question.contents.map((content, index) => (
        <QuestionItem
          key={content.id}
          index={index}
          content={content.content}
        />
      ))}
    </div>
  );
};

export default QuestionList;
