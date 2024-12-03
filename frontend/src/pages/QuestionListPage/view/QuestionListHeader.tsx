import SearchBar from "@components/common/Input/SearchBar.tsx";
import CategorySelect from "@components/common/Select/CategorySelect.tsx";
import { options } from "@/constants/CategoryData.ts";
import CreateButton from "@components/common/Button/CreateButton.tsx";
import { IoMdAdd } from "react-icons/io";

interface QuestionListHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

const QuestionListHeader = ({
  selectedCategory,
  setSelectedCategory,
}: QuestionListHeaderProps) => {
  return (
    <div className="mb-12">
      <h1 className="text-bold-l text-gray-black dark:text-white mb-6">
        질문지 리스트
      </h1>
      <div className="h-11 flex gap-2 items-stretch justify-between">
        <SearchBar text={"질문지 검색하기"} />
        <CategorySelect
          value={selectedCategory}
          setValue={setSelectedCategory}
          options={options}
        />
        <CreateButton
          path={"/questions/create"}
          text={"새로운 질문지"}
          icon={IoMdAdd}
        />
      </div>
    </div>
  );
};

export default QuestionListHeader;
