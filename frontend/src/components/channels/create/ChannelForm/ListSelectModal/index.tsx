import { Suspense, useState } from "react";
import SearchBar from "@/components/common/Input/SearchBar";
import QuestionList from "./QuestionList";
import useSessionFormStore from "@/pages/channels/create/stores/useSessionFormStore";
import CategorySelect from "@components/common/Select/CategorySelect.tsx";
import { options } from "@/constants/CategoryData.ts";
import { TabItem, TabList, TabPanel, TabProvider } from "@/components/common/Tab";
import { IoMdClose } from "@/components/common/Icons/IoMdClose";

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
  const { setSelectedOpenId } = useSessionFormStore();
  const [selectedCategory, setSelectedCategory] = useState("");

  const closeHandler = () => {
    closeModal();
    setSelectedOpenId(-1);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  // TODO: 카테고리 선택 시 해당 카테고리의 질문지 리스트를 불러오는 로직 추가
  return (
    <dialog
      ref={dialogRef}
      className="w-42.5 rounded-custom-l shadow-lg pb-5"
      onMouseDown={handleMouseDown}
    >
      <div className="flex p-8">
        <h3 className="text-bold-m text-gray-black mr-6">질문 리스트</h3>
        <button className="ml-auto" onClick={closeHandler}>
          <IoMdClose className="text-gray-black" />
        </button>
      </div>
      <div className="h-11 flex gap-2 items-stretch justify-between mx-8 mb-8">
        <CategorySelect
          value={selectedCategory}
          setValue={setSelectedCategory}
          options={options}
        />
        <SearchBar text="질문지를 검색해주세요" />
      </div>
      <TabProvider defaultTab="my" className="mt-4 mx-8">
        <TabList underline={false}>
          <TabItem id="my">나의 질문지</TabItem>
          <TabItem id="scrap">스크랩한 질문지</TabItem>
        </TabList>
        <TabPanel id="my">
          <Suspense fallback={<br />}>
            <QuestionList id="myList" />
          </Suspense>
        </TabPanel>
        <TabPanel id="scrap">
          <Suspense fallback={<br />}>
            <QuestionList id="savedList" />
          </Suspense>
        </TabPanel>
      </TabProvider>
    </dialog>
  );
};

export default ListSelectModal;
