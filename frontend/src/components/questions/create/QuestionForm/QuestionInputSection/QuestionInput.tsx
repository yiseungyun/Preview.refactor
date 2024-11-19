import { useState } from "react";
import useQuestionFormStore from "@/stores/useQuestionFormStore";
import useToast from "@/hooks/useToast";

const QuestionInput = () => {
  const toast = useToast();
  const [inputValue, setInputValue] = useState("");
  const addQuestion = useQuestionFormStore((state) => state.addQuestion);

  const enterHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (inputValue.trim().length >= 10) {
        addQuestion(inputValue.trim());
        setInputValue("");
      } else {
        toast.error("질문은 10자 이상 입력해주세요.");
      }
    };
  };

  return (
    <>
      <input
        className="text-medium-m w-full h-11 p-4 border-custom-s border-gray-100 rounded-custom-m"
        placeholder="추가할 질문을 입력하세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={enterHandler}
        maxLength={100}
      />
    </>
  );
};

export default QuestionInput;
