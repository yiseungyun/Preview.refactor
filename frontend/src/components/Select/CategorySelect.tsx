import { IoChevronDownSharp } from "../Icons";

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

const CategorySelect = <T,>({
  value,
  setValue,
  options,
  backgroundColor = "bg-white",
  defaultText,
}: SelectProps<T>) => {
  return (
    <div className={`relative h-full border-custom-s rounded-custom-m border-gray-200 ${backgroundColor}`}>
      <label aria-label="카테고리" className="absolute opacity-0">카테고리</label>
      <select
        name="category"
        aria-label="카테고리"
        defaultValue={value as string}
        onChange={(e) => setValue(e.target.value as T)}
        className="w-full text-medium-m rounded-custom-m text-gray-600 appearance-none pl-4 pr-8 h-full"
      >
        {defaultText && (
          <option value="전체" disabled>
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
        <IoChevronDownSharp size={4} className="text-gray-500" />
      </span>
    </div>
  );
};

export default CategorySelect;
