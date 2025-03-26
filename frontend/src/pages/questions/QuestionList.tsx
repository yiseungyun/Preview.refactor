import Pagination from "@/components/Pagination";
import QuestionCard from "./components/QuestionCard";
import { useGetQuestionList } from "@/hooks/api/useGetQuestionList";

interface Props {
  id: "ALL" | "SCRAP";
  selectedCategory: string;
  page: number,
  setPage: (value: number) => void;
}

const QuestionList = ({
  id,
  selectedCategory,
  page,
  setPage,
}: Props) => {
  const { data } = useGetQuestionList({ category: selectedCategory, page, limit: 12, tab: id });

  const questionList = id == "ALL"
    ? data.allQuestionLists ?? []
    : data.questionList ?? [];

  return (
    <div className="flex flex-col justify-between flex-grow">
      <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
        {questionList.map((list) => (
          <QuestionCard
            key={list.id}
            id={list.id}
            questionCount={list.questionCount ?? 0}
            category={list.categoryNames ? list.categoryNames[0] : "미분류"}
            title={list.title}
            usage={list.usage}
          />
        ))}
      </div>
      <div className="mb-20 mt-10">
        <Pagination
          currentPage={page}
          totalPage={data?.meta.totalPages || 0}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
};

export default QuestionList;
