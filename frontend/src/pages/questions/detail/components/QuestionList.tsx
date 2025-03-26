import { useGetQuestionContent } from "@/hooks/api/useGetQuestionContent";

const QuestionList = ({ questionId }: { questionId: string }) => {
  const { data: question } = useGetQuestionContent(Number(questionId));

  if (!question) return null;

  return (
    <div className="flex flex-col gap-3">
      {question.contents.map((content, index) => (
        <div key={content.id} className="flex gap-1 border-custom-s border-gray-200 rounded-custom-m p-3">
          <h3 className="text-semibold-m">Q{index + 1}.</h3>
          <p className="text-medium-l">{content.content}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
