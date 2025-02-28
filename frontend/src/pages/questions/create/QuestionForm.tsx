import useQuestionFormStore from "@/pages/questions/create/stores/useQuestionFormStore";
import AccessSection from "@/components/questions/create/AccessSection";
import CategorySection from "@/components/questions/create/CategorySection";
import TitleSection from "@/components/questions/create/TitleSection";
import QuestionInputSection from "@components/questions/create/QuestionInputSection";
import { useCreateQuestionList } from "@hooks/api/useCreateQuestionList";

const QuestionForm = () => {
  const isFormValid = useQuestionFormStore((state) => state.isFormValid);
  const { category, questionTitle, access, questionList, resetForm } =
    useQuestionFormStore();
  const isValid = isFormValid();

  const createQuestions = useCreateQuestionList();

  const submitHandler = () => {
    const requestData = {
      title: questionTitle,
      contents: questionList.map((q) => q.content),
      categoryNames: [category], // TODO: 현재 카테고리 하나만 선택 가능 - UI 변경 후 3개까지 받도록 수정
      isPublic: access === "PUBLIC",
    };
    createQuestions(requestData);
    resetForm();
  };

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
