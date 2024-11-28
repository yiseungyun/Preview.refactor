import { useState } from "react";
import CategoryTap from "@components/MyPage/CategoryTab";
import QuestionList from "@components/MyPage/QuestionList";
import Pagination from "@components/common/Pagination";

type TabName = "myList" | "savedList";

const QuestionSection = () => {
  const [tab, setTab] = useState<TabName>("myList");
  const [myListPage, setMyListPage] = useState(1);
  const [savedListPage, setSavedListPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(
    tab === "myList" ? myListPage : savedListPage
  );

  const totalPages = {
    myList: 14,
    savedList: 8,
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
    <div className="flex flex-col gap-2 mt-2">
      <CategoryTap tab={tab} setTab={setTab} />
      <QuestionList tab={tab} page={currentPage} />
      <Pagination {...getCurrentPageProps()} />
    </div>
  );
};

export default QuestionSection;
