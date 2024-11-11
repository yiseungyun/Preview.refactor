import SelectTitle from "../../SelectTitle";

const CategorySection = () => {
  return (
    <div>
      <SelectTitle title="카테고리" />
      <select className="text-medium-l">
        <option value="option1">프론트엔드</option>
        <option value="option2">백엔드</option>
      </select>
    </div>
  );
};

export default CategorySection;
