import { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import CategoryTap from "./CategoryTab";
import SearchBar from "../../../../common/SearchBar";
import useModalStore from "../../../../../stores/useModalStore";
import useModal from "../../../../../hooks/useModal";
import QuestionList from "./QuestionList";

const ListSelectModal = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isModalOpen, closeModal } = useModalStore();

  useModal({ isModalOpen, dialogRef });

  return (
    <dialog ref={dialogRef} className="w-42.5 rounded-custom-l shadow-8">
      <div className="flex p-8">
        <h3 className="text-bold-m text-gray-black mr-6">질문 리스트</h3>
        <CategoryTap />
        <button className="ml-auto" onClick={closeModal}>
          <IoMdClose className="text-gray-black w-7 h-7" />
        </button>
      </div>
      <div className="mx-8">
        <SearchBar text="질문지를 검색해주세요" />
      </div>
      <QuestionList />
    </dialog>
  );
};

export default ListSelectModal;
