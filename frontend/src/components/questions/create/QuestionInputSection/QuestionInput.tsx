import { useEffect, useRef, useState } from "react";
import useQuestionFormStore from "@/pages/CreateQuestionPage/stores/useQuestionFormStore";
import useToast from "@/hooks/useToast";
import { adjustHeight } from "../utils/textareaHeight";

const QuestionInput = () => {
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");
  const addQuestion = useQuestionFormStore((state) => state.addQuestion);
  const questionList = useQuestionFormStore((state) => state.questionList);

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, 200);
    setInputValue(newValue);
  };

  const addInput = () => {
    if (inputValue.trim().length >= 5) {
      addQuestion(inputValue.trim());
      setInputValue("");
    } else {
      toast.error("질문은 5자 이상 입력해주세요.");
    }
  };

  const enterHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      addInput();
    }
  };

  const addHandler = () => {
    addInput();
  };

  useEffect(() => {
    adjustHeight(textareaRef, inputValue);
  }, [inputValue]);

  useEffect(() => {
    setInputValue("");
  }, [questionList]);

  return (
    <div className="relative flex items-center">
      <textarea
        ref={textareaRef}
        className="text-medium-m w-full min-h-11 pl-4 pr-12 py-[0.5rem] border-custom-s border-gray-100 rounded-custom-m resize-none overflow-hidden duration-200"
        placeholder="추가할 질문을 입력하세요"
        value={inputValue}
        onChange={changeHandler}
        onKeyDown={enterHandler}
        maxLength={200}
        rows={1}
      />
      <button
        className="absolute right-4 flex gap-2 text-gray-500 text-semibold-s hover:text-gray-black transition-colors"
        onClick={addHandler}
      >
        추가
      </button>
    </div>
  );
};

export default QuestionInput;
