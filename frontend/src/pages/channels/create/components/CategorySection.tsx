import SelectTitle from "@/components/Text/SelectTitle";
import useSessionFormStore from "@/pages/channels/create/stores/useSessionFormStore";
import CategorySelect from "@/components/Select/CategorySelect";
import { options } from "@/constants/CategoryData.ts";

const CategorySection = () => {
  const { category, setCategory } = useSessionFormStore();

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
