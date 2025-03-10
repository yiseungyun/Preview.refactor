import { useGetMyQuestionList } from "@/hooks/api/useGetMyQuestionList";
import QuestionItem from "@/components/mypage/QuestionItem";
import { useGetScrapQuestionList } from "@/hooks/api/useGetScrapQuestionList";
import Pagination from "@/components/common/Pagination";
import { useState } from "react";

interface ListProps {
  id: "myList" | "savedList";
}

const QuestionList = ({ id }: ListProps) => {
  const [page, setPage] = useState(1);
  const { data: myData } = useGetMyQuestionList({ page, limit: 6 });
  const { data: scrapData } = useGetScrapQuestionList({ page, limit: 6 });

  const totalPages = {
    myList: myData?.meta.totalPages || 0,
    savedList: scrapData?.meta.totalPages || 0,
  };

  const getCurrentPageProps = () => ({
    currentPage: page,
    totalPage: totalPages[id],
    onPageChange: (page: number) => {
      setPage(page);
    },
  });

  const currentQuestionList = id === "myList" ? myData?.myQuestionLists : scrapData?.questionList;

  return (
    <div>
      <div className="my-4 w-full grid grid-cols-2 xl:grid-cols-3 gap-4">
        {
          currentQuestionList && currentQuestionList.length > 0 ? (
            currentQuestionList.map((question) => (
              <QuestionItem
                key={question.id}
                questionListId={question.id}
                type={id === "myList" ? "my" : "saved"}
                page={page}
              />
            ))
          ) : (
            <div className="w-full text-gray-500 text-semibold-m">
              질문 목록이 비어있습니다
            </div>
          )
        }
      </div>
      <div className="mt-10 pb-4">
        <Pagination {...getCurrentPageProps()} />
      </div>
    </div>
  );
};

export default QuestionList;
