import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface ItemProps {
  content: string;
  onDelete: () => void;
  onEdit: () => void;
}

const QuestionItem = ({ content, onDelete, onEdit }: ItemProps) => {
  return (
    <div className="flex gap-2 justify-between items-center w-full min-h-11 px-4 py-3 shadow-16 rounded-custom-m">
      <span className="text-medium-m text-gray-black">{content}</span>
      <div className="flex text-gray-500 gap-2">
        <button onClick={onEdit}>
          <MdEdit className="w-5 h-5 hover:text-gray-black" />
        </button>
        <button onClick={onDelete}>
          <RiDeleteBin6Fill className="w-5 h-5 hover:text-gray-black" />
        </button>
      </div>
    </div>
  );
};

export default QuestionItem;
