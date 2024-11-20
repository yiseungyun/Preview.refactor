import useQuestionFormStore from "@/stores/useQuestionFormStore";
import AccessSection from "./AccessSection";
import CategorySection from "./CategorySection";
import TitleSection from "./TitleSection";
import QuestionInputSection from "./QuestionInputSection";

const QuestionForm = () => {
  const isValid = useQuestionFormStore((state) => state.isFormValid());
  const submitHandler = () => {};

  return (
    <div className="flex flex-col gap-7 p-8 bg-gray-white shadow-8 w-47.5 rounded-custom-l">
      <CategorySection />
      <TitleSection />
      <AccessSection />
      <QuestionInputSection />
      <button
        className={`w-full h-12 rounded-custom-m text-semibold-r text-gray-white
        ${isValid ? "bg-green-200" : "bg-gray-200"}
          `}
        onClick={submitHandler}
        disabled={!isValid}
      >
        질문지 생성하기
      </button>
    </div>
  );
};

export default QuestionForm;
