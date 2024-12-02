import { useGetQuestionContent } from "@/hooks/api/useGetQuestionContent";
import QuestionItem from "./QuestionItem";
import ErrorBlock from "@components/common/Error/ErrorBlock.tsx";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";

const QuestionList = ({ questionId }: { questionId: string }) => {
  const {
    data: question,
    isLoading,
    error,
  } = useGetQuestionContent(Number(questionId));

  if (isLoading) return <LoadingIndicator loadingState={isLoading} />;
  if (error)
    return (
      <ErrorBlock
        error={error}
        message={"질문지 내용을 불러오는데 실패했습니다."}
      />
    );
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
