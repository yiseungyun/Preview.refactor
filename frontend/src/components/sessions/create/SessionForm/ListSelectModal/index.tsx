import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import CategoryTap from "./CategoryTab";
import SearchBar from "../../../../utils/SearchBar";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (modal: boolean) => void;
}

type Tab = "myList" | "savedList";

const ListSelectModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<Tab>("myList");

  const closeModal = () => {
    dialogRef.current?.close();
    setIsModalOpen(false);
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isModalOpen && dialog) {
      dialogRef.current?.showModal();
    }

    return () => {
      if (dialog) {
        dialog.close();
      }
    };
  }, [isModalOpen]);

  return (
    <dialog ref={dialogRef} className="w-42.5 rounded-custom-l shadow-8">
      <div className="flex p-8">
        <h3 className="text-bold-m text-gray-black mr-6">질문 리스트</h3>
        <CategoryTap tab={tab} setTab={setTab} />
        <button className="ml-auto" onClick={closeModal}>
          <IoMdClose className="text-gray-black w-7 h-7" />
        </button>
      </div>
      <div className="mx-8">
        <SearchBar text="질문지를 선택해주세요" />
      </div>
      <div>

      </div>
    </dialog>
  );
};

export default ListSelectModal;
