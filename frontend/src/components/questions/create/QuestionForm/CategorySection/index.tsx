import SelectTitle from "@/components/common/SelectTitle";
import { options } from "./data";
import useQuestionFormStore from "@/stores/useQuestionFormStore";
import Select from "@/components/common/Select";

const CategorySection = () => {
  const { category, setCategory } = useQuestionFormStore();

  return (
    <div>
      <SelectTitle title="카테고리" />
      <Select
        defaultText="카테고리를 선택해주세요"
        options={options}
        value={category}
        setValue={setCategory}
      />
    </div>
  );
};

export default CategorySection;
