import SelectTitle from "@/components/common/SelectTitle";
import QuestionInput from "./QuestionInput";
import QuestionList from "./QuestionList";
import useQuestionFormStore from "@/stores/useQuestionFormStore";

const QuestionInputSection = () => {
  const questionList = useQuestionFormStore((state) => state.questionList);

  return (
    <div className="flex flex-col">
      <div className="flex">
        <SelectTitle title="질문" />
        <span>{questionList.length}/20</span>
      </div>
      <QuestionInput />
      <QuestionList />
    </div>
  );
};

export default QuestionInputSection;
