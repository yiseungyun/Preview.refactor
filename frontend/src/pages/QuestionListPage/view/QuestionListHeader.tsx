import SearchBar from "@components/common/Input/SearchBar.tsx";
import CategorySelect from "@components/common/Select/CategorySelect.tsx";
import { options } from "@/constants/CategoryData.ts";
import CreateButton from "@components/common/Button/CreateButton.tsx";
import { IoMdAdd } from "react-icons/io";

interface QuestionListHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  tab: "ALL" | "SCRAP";
  setTab: (value: "ALL" | "SCRAP") => void;
}

const QuestionListHeader = ({
  selectedCategory,
  setSelectedCategory,
  tab,
  setTab,
}: QuestionListHeaderProps) => {
  const selectedClassName = "text-green-600 text-semibold-r";
  return (
    <div className="mb-12">
      <h1 className="text-bold-l text-gray-black dark:text-white mb-6">
        질문지 리스트
      </h1>
      <div className="h-11 flex gap-2 items-stretch justify-between">
        <CategorySelect
          value={selectedCategory}
          setValue={setSelectedCategory}
          options={options}
        />
        <SearchBar text={"질문지 검색하기"} />

        <CreateButton
          path={"/questions/create"}
          text={"새로운 질문지"}
          icon={IoMdAdd}
        />
      </div>
      <div className={"relative border-b mt-4 pt-4 py-2 flex gap-4  "}>
        <button
          onClick={() => setTab("ALL")}
          className={`${tab === "ALL" && selectedClassName} w-28 h-full`}
        >
          전체 질문지
        </button>
        <button
          onClick={() => setTab("SCRAP")}
          className={`${tab === "SCRAP" && selectedClassName} w-28 h-full`}
        >
          스크랩한 질문지
        </button>
        <div
          className={`absolute -z-0 pointer-events-none top-0 ${tab === "SCRAP" ? "left-32" : "left-0"} transition-all duration-200 pt-4 py-2 p-1 border-b border-green-200 h-full w-28`}
        ></div>
      </div>
    </div>
  );
};

export default QuestionListHeader;
