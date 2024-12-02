import { useState } from "react";
import CategoryTap from "@components/mypage/CategoryTab";
import QuestionList from "@components/mypage/QuestionList";
import Pagination from "@components/common/Pagination";
import { useGetMyQuestionList } from "@/hooks/api/useGetMyQuestionList";
import { useGetScrapQuestionList } from "@/hooks/api/useGetScrapQuestionList";

type TabName = "myList" | "savedList";

const QuestionSection = () => {
  const [tab, setTab] = useState<TabName>("myList");
  const [myListPage, setMyListPage] = useState(1);
  const [savedListPage, setSavedListPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(
    tab === "myList" ? myListPage : savedListPage
  );

  const {
    data: myData,
    isLoading: isMyListLoading,
    error: myListError,
  } = useGetMyQuestionList({ page: myListPage, limit: 8 });
  const {
    data: scrapData,
    isLoading: isScrapListLoading,
    error: scrapListError,
  } = useGetScrapQuestionList({ page: savedListPage, limit: 8 });

  const isLoading = tab === "myList" ? isMyListLoading : isScrapListLoading;
  const error = tab === "myList" ? myListError : scrapListError;

  if (isLoading) return <div>로딩 중</div>;
  if (error) return <div>에러 발생</div>;

  const totalPages = {
    myList: myData?.meta.totalPages || 0,
    savedList: scrapData?.meta.totalPages || 0,
  };

  const getCurrentPageProps = () => ({
    currentPage: tab === "myList" ? myListPage : savedListPage,
    totalPage: totalPages[tab],
    onPageChange: (page: number) => {
      if (tab === "myList") {
        setMyListPage(page);
      } else {
        setSavedListPage(page);
      }
      setCurrentPage(page);
    },
  });

  return (
    <div className="flex flex-col w-full gap-2 mt-2">
      <CategoryTap tab={tab} setTab={setTab} />
      <QuestionList tab={tab} page={currentPage} />
      <Pagination {...getCurrentPageProps()} />
    </div>
  );
};

export default QuestionSection;
