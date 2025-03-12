import { FaRegBookmark } from "@/components/common/Icons/FaRegBookmark";
import { FaRegUser } from "@/components/common/Icons/FaRegUser";
import { MdEdit } from "@/components/common/Icons/MdEdit";
import { RiDeleteBin6Fill } from "@/components/common/Icons/RiDeleteBin6Fill";
import { useGetQuestionContent } from "@/hooks/api/useGetQuestionContent";

const QuestionTitle = ({ questionId }: { questionId: string }) => {
  const { data: question } = useGetQuestionContent(Number(questionId));
  if (!question) return null;

  return (
    <div className="mb-4 flex flex-col gap-2">
      <div className="flex justify-between">
        <h3 className="text-semibold-l">{question.title}</h3>
        <div className="flex gap-3 text-gray-500 dark:text-gray-200">
          <button>
            <MdEdit size={6} className="hover:text-gray-black" />
          </button>
          <button>
            <RiDeleteBin6Fill size={6} className="hover:text-gray-black" />
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="inline-flex items-center gap-1 text-medium-m text-gray-400 dark:text-gray-200">
          <FaRegUser />
          작성자 {question.username} • {question.contents.length}개의 질문
        </div>
        <div className="flex gap-1 items-center">
          <FaRegBookmark />
          <span>{question.scrapCount}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionTitle;
