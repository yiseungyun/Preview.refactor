import SelectTitle from "@/components/common/SelectTitle";
import useSessionFormStore from "@/stores/useSessionFormStore";
import CategorySelector from "@/components/common/CategorySelector";

const options = [
  {
    value: "프론트엔드",
    label: "프론트엔드",
  },
  {
    value: "백엔드",
    label: "백엔드",
  },
];

const CategorySection = () => {
  const { category, setCategory } = useSessionFormStore();

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
