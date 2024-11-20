import { useEffect, useRef } from "react";
import { adjustHeight } from "../utils/textarea";

interface EditInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditInput = ({ value, onChange, onSave, onCancel }: EditInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, 100);
    onChange(newValue);
  };

  useEffect(() => {
    adjustHeight(textareaRef, value);
  }, [value]);

  return (
    <div className="flex items-center relative">
      <textarea
        ref={textareaRef}
        className="w-full min-h-11 pl-4 pr-24 py-3 shadow-16 rounded-custom-m text-medium-m text-gray-black resize-none duration-200 overflow-hidden"
        value={value}
        onChange={changeHandler}
        rows={1}
      />
      <div className="absolute right-4 flex gap-2 text-gray-500 text-semibold-s">
        <button
          onClick={onSave}
          className="hover:text-gray-black transition-colors"
        >
          저장
        </button>
        <button
          onClick={onCancel}
          className="hover:text-gray-black transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default EditInput;
