import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import CategoryTap from "./CategoryTab";
import SearchBar from "../../../../common/SearchBar";
import { data } from "./data";
import { GrUp } from "react-icons/gr";
import { GrDown } from "react-icons/gr";
import { ImCheckmark } from "react-icons/im";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (modal: boolean) => void;
}

type Tab = "myList" | "savedList";

interface SelectedItem {
  tab: Tab;
  id: number;
}

const ListSelectModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<Tab>("myList");
  const [selectedItem, setSelecetedItem] = useState<SelectedItem>();
  const [selectedOpen, setSelectedOpen] = useState<SelectedItem | null>();

  const closeModal = () => {
    dialogRef.current?.close();
    setIsModalOpen(false);
  };

  const checkHandler = (id: number) => {
    setSelecetedItem({ tab: tab, id });
  };

  const openListHandler = (id: number) => {
    if (selectedOpen?.id === id) {
      setSelectedOpen(null);
    } else {
      setSelectedOpen({ tab: tab, id });
    }

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
        <SearchBar text="질문지를 검색해주세요" />
      </div>
      <div className="mb-4">
        {data[tab].map((item, id) => {
          const isSelected =
            selectedItem?.tab === tab && selectedItem.id === id;
          const isListOpen =
            selectedOpen?.tab === tab && selectedOpen.id === id;

          return (
            <div key={id}>
              <div className="flex flex-row items-center w-full h-20 border-t-custom-s px-8 py-4">
                <button
                  className="mr-6"
                  onClick={() => {
                    openListHandler(id);
                  }}
                >
                  {isListOpen ? (
                    <GrUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <GrDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <div>
                  <div className="flex gap-3">
                    <div>{item.category}</div>
                    <span className="text-medium-s text-gray-600">
                      {item.user_name} • {item.count}개의 질문
                    </span>
                  </div>
                  <p className="text-semibold-r text-gray-black">
                    {item.title}
                  </p>
                </div>
                <button
                  className={`flex items-center ml-auto w-10 h-10 rounded-custom-m
                    ${isSelected
                      ? "bg-green-200 text-green-50"
                      : "bg-gray-300 text-gray-50"
                    }`}
                  onClick={() => checkHandler(id)}
                >
                  <ImCheckmark className="m-auto w-5 h-5" />
                </button>
              </div>
              {isListOpen ? (
                <div className="bg-gray-50 px-20 py-5">
                  {item.questions.map((item) => {
                    return (
                      <p key={item.id} className="text-medium-r text-gray-600">
                        {item.question}
                      </p>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </dialog>
  );
};

export default ListSelectModal;
