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
  defaultText?: string;
}

const Select = <T,>({
  value,
  setValue,
  options,
  backgroundColor = "bg-white",
  defaultText,
}: SelectProps<T>) => {
  return (
    <div className="relative inline-flex gap-2 items-center border-custom-s rounded-custom-m border-gray-200">
      <select
        defaultValue={value as string}
        onChange={(e) => setValue(e.target.value as T)}
        className={`rounded-custom-m ${backgroundColor} text-semibold-r text-gray-600 appearance-none pl-4 pr-8 h-full`}
      >
        {defaultText && (
          <option value="" disabled>
            {defaultText}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value as string} value={option.value as string}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none">
        <IoChevronDownSharp className="w-4 h-4 text-gray-600" />
      </span>
    </div>
  );
};

export default Select;
