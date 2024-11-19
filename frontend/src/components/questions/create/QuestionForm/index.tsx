import AccessSection from "./AccessSection";
import CategorySection from "./CategorySection";
import TitleSection from "./TitleSection";

const QuestionForm = () => {
  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-white shadow-8 w-47.5 rounded-custom-l">
      <CategorySection />
      <TitleSection />
      <AccessSection />
      <button> 질문지 생성하기</button>
    </div >
  );
};

export default QuestionForm;