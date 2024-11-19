import { useState } from "react";
import useQuestionFormStore from "@/stores/useQuestionFormStore";

const QuestionInput = () => {
  const [inputValue, setInputValue] = useState("");
  const addQuestion = useQuestionFormStore((state) => state.addQuestion);

  const enterHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim().length >= 10) {
      addQuestion(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <>
      <input
        className="text-medium-m w-full h-11 p-4 border-custom-s border-gray-100 rounded-custom-m"
        placeholder="추가할 질문을 입력하세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={enterHandler}
      />
    </>
  );
};

export default QuestionInput;
