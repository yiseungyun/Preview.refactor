import Pagination from "@/components/Pagination";
import QuestionItem from "./QuestionItem";
import { useGetMyQuestionList } from "@/hooks/api/useGetMyQuestionList";
import { useGetScrapQuestionList } from "@/hooks/api/useGetScrapQuestionList";
import { useState } from "react";

interface QuestionList {
  id: number;
  title: string;
  contents: Question[];
  categoryNames: string[];
  isPublic: boolean;
  usage: number;
}

interface Question {
  id: number;
  content: string;
  index: number;
  questionListId: number;
}

interface ListProps {
  id: "myList" | "savedList";
}

const MAX_ITEM_PER_PAGE = 4;

const QuestionList = ({ id }: ListProps) => {
  const [page, setPage] = useState(1);

  const { data: myQuestionList } = useGetMyQuestionList({
    page: page,
    limit: MAX_ITEM_PER_PAGE,
  });

  const { data: scrapQuestionList } = useGetScrapQuestionList({
    page: page,
    limit: MAX_ITEM_PER_PAGE,
  });

  const questionList = id === "myList"
    ? myQuestionList?.myQuestionLists
    : scrapQuestionList?.questionList;

  const totalPage = id === "myList"
    ? myQuestionList?.meta.totalPages || 1
    : scrapQuestionList?.meta.totalPages || 1;

  const getCurrentPageProps = () => ({
    currentPage: page,
    totalPage: totalPage,
    onPageChange: (page: number) => {
      setPage(page);
    },
  });

  return (
    <div className="mb-4 h-88 overflow-y-auto">
      {
        questionList.length > 0 ? (
          questionList.map((item, id) => {
            return (
              <div key={id}>
                <QuestionItem className={id === questionList.length - 1 ? "border-b-custom-s" : ""} item={item} />
              </div>
            );
          })
        ) : null
      }
      <div className="mt-6">
        <Pagination {...getCurrentPageProps()} />
      </div>
    </div>
  );
};

export default QuestionList;
