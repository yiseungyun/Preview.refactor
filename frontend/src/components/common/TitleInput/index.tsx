import { useState } from "react";

interface TitleProps {
  placeholder: string;
  onChange: (title: string) => void;
  minLength?: number;
  maxLength?: number;
}

const TitleInput = ({
  placeholder,
  onChange,
  minLength = 5,
  maxLength = 20
}: TitleProps) => {
  const [charCount, setCharCount] = useState<number>(0);
  const [value, setValue] = useState<string>('');

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length <= maxLength) {
      setValue(newValue);
      setCharCount(newValue.length);
      onChange(newValue);
    }
  };

  const getCounterColor = () => {
    if (charCount === 0) return 'text-gray-500';
    if (charCount < minLength) return 'text-point-1';
    if (charCount === maxLength) return 'text-point-1';
    return 'text-gray-500';
  };

  const getMessage = () => {
    return `${charCount}/${maxLength}`;
  };

  return (
    <div className="relative w-full">
      <input
        value={value}
        className={"text-medium-m w-full h-11 p-4 pr-20 border-custom-s rounded-custom-m"}
        placeholder={placeholder}
        onChange={changeHandler}
        minLength={minLength}
        maxLength={maxLength}
      />
      <div
        className={`absolute right-4 bottom-3 text-medium-s ${getCounterColor()} transition-colors`}
      >
        {getMessage()}
      </div>
    </div>
  );
};

export default TitleInput;