import useQuestionFormStore from "@/stores/useQuestionFormStore";
import AccessSection from "./AccessSection";
import CategorySection from "./CategorySection";
import TitleSection from "./TitleSection";
import QuestionInputSection from "./QuestionInputSection";
import { useMutation } from "@tanstack/react-query";
import { createQuestionList } from "@/api/questions/create";
import useToast from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

const QuestionForm = () => {
  const isValid = useQuestionFormStore((state) => state.isFormValid());
  const {
    category,
    questionTitle,
    access,
    questionList,
  } = useQuestionFormStore();
  const toast = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createQuestionList,
    onSuccess: (response) => {
      const questionListId = response.data.createdQuestionList.id;
      toast.success("질문지 생성에 성공했습니다.");
      navigate(`questions/${questionListId}`);
    },
    onError: () => {
      toast.error("질문지 생성에 실패했습니다.");
    }
  })

  const submitHandler = () => {
    const requestData = {
      title: questionTitle,
      contents: questionList.map(q => q.content),
      categoryNames: [category], // TODO: 현재 카테고리 하나만 선택 가능 - UI 변경 후 3개까지 받도록 수정
      isPublic: access === "PUBLIC"
    }

    mutation.mutate(requestData);
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
