import { Link } from "react-router-dom";
import { FaUserGroup } from "../common/Icons/FaUserGroup";

interface QuestionCardProps {
  id: number;
  title: string;
  questionCount: number;
  usage: number;
  isStarred?: boolean;
  category: string;
}

const QuestionCard = ({
  id,
  title,
  questionCount,
  usage,
  category,
}: QuestionCardProps) => {
  return (
    <Link
      to={`/questions/${id}`}
      className="relative h-40 bg-white rounded-custom-m px-5 py-6 transition-all duration-200 ease-in-out hover:-translate-y-1.5 border-custom-s border-gray-200 hover:shadow-16 hover:ring-1 hover:ring-green-200"
    >
      <div className="flex-grow flex flex-col items-start">
        <span className="text-semibold-s text-green-600 bg-green-50 border-custom-s border-gray-300 rounded-2xl py-px px-2">
          {category}
        </span>
      </div>
      <h3 className="text-semibold-m mx-0.5 mt-2.5 mb-0.5">{title}</h3>
      <div className="absolute bottom-5 left-5 right-5 text-medium-r flex justify-between">
        <span className="text-gray-600">
          <span>{questionCount}</span>
          <span>문항</span></span>
        <span className="text-gray-black flex gap-1.5 items-center">
          <FaUserGroup className="text-green-400" />
          {usage}
        </span>
      </div>
    </Link>
  );
};

export default QuestionCard;