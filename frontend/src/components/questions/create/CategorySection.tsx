import SelectTitle from "@/components/common/Text/SelectTitle";
import { options } from "./utils/categoryData";
import useQuestionFormStore from "@/pages/questions/create/stores/useQuestionFormStore";
import CategorySelect from "@/components/common/Select/CategorySelect";

const CategorySection = () => {
  const { category, setCategory } = useQuestionFormStore();

  return (
    <div>
      <SelectTitle title="카테고리" />
      <div className="h-11">
        <CategorySelect
          defaultText="카테고리를 선택해주세요"
          options={options}
          value={category}
          setValue={setCategory}
        />
      </div>
    </div>
  );
};

export default CategorySection;
