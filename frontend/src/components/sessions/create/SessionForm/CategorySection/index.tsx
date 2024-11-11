import { IoChevronDownSharp } from "react-icons/io5";
import SelectTitle from "../../SelectTitle";
import { useState } from "react";

const CategorySection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  }

  return (
    <div>
      <SelectTitle title="카테고리" />
      <div className="relative">
        <select
          className="text-medium-m w-full h-11 pl-4 border-custom-s border-gray-100 rounded-custom-m appearance-none"
          value={selectedCategory}
          onChange={handleChange}
        >
          <option value="" disabled>카테고리를 선택해주세요</option>
          <option value="option1">프론트엔드</option>
          <option value="option2">백엔드</option>
        </select>
        <span className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none">
          <IoChevronDownSharp className="w-5 h-5 text-gray-400" />
        </span>
      </div>
    </div>
  );
};

export default CategorySection;
