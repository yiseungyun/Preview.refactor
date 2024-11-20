import SelectTitle from "@/components/common/SelectTitle";
import CategorySelector from "@/components/common/CategorySelector";
import { options } from "./data";
import useQuestionFormStore from "@/stores/useQuestionFormStore";

const CategorySection = () => {
  const { category, setCategory } = useQuestionFormStore();

  return (
    <div>
      <SelectTitle title="카테고리" />
      <CategorySelector
        title="카테고리를 선택해주세요"
        options={options}
        value={category}
        onChange={setCategory}
      />
    </div>
  );
};

export default CategorySection;
