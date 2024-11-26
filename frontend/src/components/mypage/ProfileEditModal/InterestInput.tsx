import { useEffect, useState } from "react";
import useQuestionFormStore from "@stores/useQuestionFormStore";

const InterestInput = () => {
  const [inputValue, setInputValue] = useState("");
  const addQuestion = useQuestionFormStore((state) => state.addQuestion);
  const questionList = useQuestionFormStore((state) => state.questionList);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, 10);
    setInputValue(newValue);
  };

  const addInput = () => {
    if (inputValue.trim().length >= 1) {
      addQuestion(inputValue.trim());
      setInputValue("");
    }
  };

  const enterHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      addInput();
    }
  };

  const addHandler = () => {
    addInput();
  };

  useEffect(() => {
    setInputValue("");
  }, [questionList]);

  return (
    <div className="relative flex items-center">
      <input
        className="text-medium-m w-full min-h-11 pl-4 pr-12 py-[0.5rem] border-custom-s border-gray-200 rounded-custom-m resize-none overflow-hidden duration-200"
        placeholder="관심분야를 입력하세요"
        value={inputValue}
        onChange={changeHandler}
        onKeyDown={enterHandler}
        maxLength={10}
      />
      <button
        className="absolute right-4 flex gap-2 text-gray-500 text-semibold-r hover:text-gray-black transition-colors"
        onClick={addHandler}
      >
        추가
      </button>
    </div>
  );
};

export default InterestInput;
