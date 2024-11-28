import { useGetQuestionContent } from "@/hooks/api/useGetQuestionContent";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ questionId }: { questionId: string }) => {
  const {
    data: question,
    isLoading,
    isError,
    error,
  } = useGetQuestionContent(questionId);

  if (isLoading) return <div>로딩 중</div>;
  if (isError) return <div>에러가 발생했습니다: {error.message}</div>;
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
