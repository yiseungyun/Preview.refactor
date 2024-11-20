import { IoChevronDownSharp } from "react-icons/io5";

type Option = {
  label: string;
  value: string;
};

interface SelectProps {
  options: Option[];
  backgroundColor?: string;
}

const Select = ({ options, backgroundColor = "bg-green-200" }: SelectProps) => {
  return (
    <div className="relative inline-block items-center">
      <select
        className={`rounded-custom-m ${backgroundColor} text-semibold-r text-gray-white appearance-none pl-5 pr-11 h-full`}
      >
        {options.map((option) => (
          <option key={option.value}>{option.label}</option>
        ))}
      </select>
      <span className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none">
        <IoChevronDownSharp className="w-5 h-5 text-gray-white" />
      </span>
    </div>
  );
};

export default Select;
