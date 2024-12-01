import SelectTitle from "@/components/common/SelectTitle";
import useSessionFormStore from "@/stores/useSessionFormStore";
import Select from "@/components/common/Select";

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
