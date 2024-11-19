import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface ItemProps {
  content: string;
}

const QuestionItem = ({ content }: ItemProps) => {
  return (
    <div className="flex justify-between items-center w-full h-11 p-4 shadow-16 rounded-custom-m">
      <span className="text-medium-m text-gray-black">{content}</span>
      <div className="flex text-gray-500 gap-1">
        <button>
          <MdEdit className="w-5 h-5" />
        </button>
        <button>
          <RiDeleteBin6Fill className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuestionItem;
