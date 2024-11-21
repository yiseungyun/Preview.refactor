import { IoChevronDownSharp } from "react-icons/io5";

interface Option {
  value: string;
  label: string;
}

interface CategoryProps {
  title: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const CategorySelector = ({
  title,
  options,
  value,
  onChange,
}: CategoryProps) => {
  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="relative">
      <select
        className="text-medium-m w-full h-11 pl-4 border-custom-s border-gray-100 rounded-custom-m appearance-none"
        value={value}
        onChange={changeHandler}
      >
        <option value="" disabled>
          {title}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none">
        <IoChevronDownSharp className="w-5 h-5 text-gray-400" />
      </span>
    </div>
  );
};

export default CategorySelector;
