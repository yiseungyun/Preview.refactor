import { useGetQuestion } from "@hooks/api/useGetQuestion.ts";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";

const QuestionTitle = ({ questionId }: { questionId: string }) => {
  const {
    data: question,
    isLoading,
    isError,
    error,
  } = useGetQuestion(questionId);

  if (isLoading) return <div>로딩 중</div>;
  if (isError) return <div>에러가 발생했습니다: {error.message}</div>;
  if (!question) return null;

  return (
    <div className="mb-4 flex flex-col gap-2">
      <div className="flex justify-between">
        <h3 className="text-semibold-l">{question.title}</h3>
        <div className="flex gap-3 text-gray-500">
          <button>
            <MdEdit className="w-6 h-6 hover:text-gray-black" />
          </button>
          <button>
            <RiDeleteBin6Fill className="w-6 h-6 hover:text-gray-black" />
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <span className="text-medium-m text-gray-400">
          작성자 {question.username} • {question.contents.length}개의 질문
        </span>
        <div className="flex gap-1 items-center">
          <FaRegBookmark />
          <span>{question.usage}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionTitle;
