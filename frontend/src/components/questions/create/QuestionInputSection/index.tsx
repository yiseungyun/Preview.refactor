import SelectTitle from "@/components/common/Text/SelectTitle";
import QuestionInput from "./QuestionInput";
import QuestionList from "./QuestionList";
import useQuestionFormStore from "@/pages/CreateQuestionPage/stores/useQuestionFormStore";

const QuestionInputSection = () => {
  const questionList = useQuestionFormStore((state) => state.questionList);

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 items-center h-auto">
        <SelectTitle title="질문" />
        <span className="text-medium-s text-gray-500 h-8">
          {questionList.length}/20
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <QuestionInput />
        <QuestionList />
      </div>
    </div>
  );
};

export default QuestionInputSection;
