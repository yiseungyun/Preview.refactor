import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import CategoryTap from "@/components/sessions/create/SessionForm/ListSelectModal/CategoryTab";
import SearchBar from "@components/common/SearchBar";
import useModalStore from "@stores/useModalStore";
import useModal from "@hooks/useModal";
import QuestionList from "./QuestionList";
import useSessionFormStore from "@stores/useSessionFormStore";
import Pagination from "./Pagination";

const ListSelectModal = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isModalOpen, closeModal } = useModalStore();
  const { tab, setTab, setSelectedOpenId } = useSessionFormStore();
  const [myListPage, setMyListPage] = useState(1);
  const [savedListPage, setSavedListPage] = useState(1);

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
    },
  });

  useModal({ isModalOpen, dialogRef });

  const closeHandler = () => {
    closeModal();
    setTab("myList");
    setSelectedOpenId(-1);
  };

  return (
    <dialog ref={dialogRef} className="w-42.5 rounded-custom-l shadow-8">
      <div className="flex p-8">
        <h3 className="text-bold-m text-gray-black mr-6">질문 리스트</h3>
        <CategoryTap />
        <button className="ml-auto" onClick={closeHandler}>
          <IoMdClose className="text-gray-black w-7 h-7" />
        </button>
      </div>
      <div className="mx-8 mb-8">
        <SearchBar text="질문지를 검색해주세요" />
      </div>
      <QuestionList page={getCurrentPageProps().currentPage} />
      <Pagination {...getCurrentPageProps()} />
    </dialog>
  );
};

export default ListSelectModal;
