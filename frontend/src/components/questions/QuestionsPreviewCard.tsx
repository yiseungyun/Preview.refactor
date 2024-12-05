import { FaStar, FaUsers } from "react-icons/fa6";
import { Link } from "react-router-dom";

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
  isStarred = false,
  category,
}: QuestionCardProps) => {
  return (
    <Link
      to={`/questions/${id}`}
      className="bg-white backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:bg-gray-200/70 cursor-pointer group duration-200 ease-in-out hover:-translate-y-1.5 hover:border-green-200 dark:bg-gray-900/80 dark:border-gray-700 dark:hover:bg-gray-600/70 hover:shadow-16"
    >
      <div className="flex justify-between items-start mb-3 pt-1">
        <span className="px-3 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400 text-sm rounded-full">
          {category}
        </span>
        <FaStar
          className={`w-5 h-5 ${isStarred
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-500 group-hover:text-gray-400"
            }`}
        />
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white pl-1 mb-4 line-clamp-2">
        {title}
      </h3>
      <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-100">
        <div className="flex items-center gap-1 pl-1">
          <>
            <span>{questionCount}</span>
            <span>문항</span>
          </>
        </div>

        <div className="flex items-center gap-2">
          <FaUsers className="w-4 h-4" />
          <span>{usage}</span>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
