import { IoChevronDownSharp } from "react-icons/io5";

type Option<T> = {
  label: string;
  value: T;
};

interface SelectProps<T> {
  value: T;
  setValue: (value: T) => void;
  options: Option<T>[];
  backgroundColor?: string;
}

const Select = <T,>({
  value,
  setValue,
  options,
  backgroundColor = "bg-green-200",
}: SelectProps<T>) => {
  return (
    <div className="relative inline-flex gap-2 items-center">
      <select
        defaultValue={value as string}
        onChange={(e) => setValue(e.target.value as T)}
        className={`rounded-custom-m ${backgroundColor} text-semibold-r text-gray-white appearance-none pl-4 pr-8 h-full`}
      >
        {options.map((option) => (
          <option key={option.value as string} value={option.value as string}>
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
