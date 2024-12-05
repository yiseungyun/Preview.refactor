import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CategoryTab from "@components/sessions/create/SessionForm/ListSelectModal/CategoryTab";
import SearchBar from "@/components/common/Input/SearchBar";
import QuestionList from "./QuestionList";
import useSessionFormStore from "@/pages/CreateSessionPage/stores/useSessionFormStore";
import Pagination from "@components/common/Pagination";
import { useGetMyQuestionList } from "@hooks/api/useGetMyQuestionList.ts";
import ErrorBlock from "@components/common/Error/ErrorBlock.tsx";
import { useGetScrapQuestionList } from "@hooks/api/useGetScrapQuestionList.ts";

interface UseModalReturn {
  dialogRef: React.RefObject<HTMLDialogElement>;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

interface ModalProps {
  modal: UseModalReturn;
}

const ListSelectModal = ({ modal: { dialogRef, closeModal } }: ModalProps) => {
  const { tab, setTab, setSelectedOpenId } = useSessionFormStore();
  const [page, setPage] = useState(1);
  const MAX_ITEM_PER_PAGE = 4;
  const {
    data: myQuestionList,
    isLoading: myQuestionLoading,
    error: myQuestionError,
  } = useGetMyQuestionList({
    page: page,
    limit: MAX_ITEM_PER_PAGE,
  });

  const {
    data: scrapQuestionList,
    isLoading: scrapQuestionLoading,
    error: scrapError,
  } = useGetScrapQuestionList({
    page: page,
    limit: MAX_ITEM_PER_PAGE,
  });

  const questionList =
    tab === "myList"
      ? myQuestionList?.myQuestionLists
      : scrapQuestionList?.questionList;
  const isLoading = tab === "myList" ? myQuestionLoading : scrapQuestionLoading;
  const error = tab === "myList" ? myQuestionError : scrapError;
  const totalPage =
    tab === "myList"
      ? myQuestionList?.meta.totalPages || 1
      : scrapQuestionList?.meta.totalPages || 1;

  const getCurrentPageProps = () => ({
    currentPage: page,
    totalPage: totalPage,
    onPageChange: (page: number) => {
      setPage(page);
    },
  });

  const closeHandler = () => {
    closeModal();
    setTab("myList");
    setSelectedOpenId(-1);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="w-42.5 rounded-custom-l shadow-lg pb-5"
      onMouseDown={handleMouseDown}
    >
      <div className="flex p-8">
        <h3 className="text-bold-m text-gray-black mr-6">질문 리스트</h3>
        <CategoryTab />
        <button className="ml-auto" onClick={closeHandler}>
          <IoMdClose className="text-gray-black w-7 h-7" />
        </button>
      </div>
      <div className="mx-8 mb-8">
        <SearchBar text="질문지를 검색해주세요" />
      </div>
      <QuestionList
        questionList={questionList || []}
        questionLoading={isLoading}
      />
      <ErrorBlock error={error} message={"질문지를 불러오는데 실패했습니다."} />
      <Pagination {...getCurrentPageProps()} />
    </dialog>
  );
};

export default ListSelectModal;
