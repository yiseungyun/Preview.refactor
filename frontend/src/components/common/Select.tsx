import { IoChevronDownSharp } from "react-icons/io5";

type Option = {
  label: string;
  value: string;
};

interface SelectProps {
  setValue: (value: string) => void;
  options: Option[];
  backgroundColor?: string;
}

const Select = ({
  setValue,
  options,
  backgroundColor = "bg-green-200",
}: SelectProps) => {
  return (
    <div className="relative inline-flex gap-2 items-center">
      <select
        onChange={(e) => setValue(e.target.value)}
        className={`rounded-custom-m ${backgroundColor} text-semibold-r text-gray-white appearance-none pl-4 pr-8 h-full`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none">
        <IoChevronDownSharp className="w-5 h-5 text-gray-white" />
      </span>
    </div>
  );
};

export default Select;
