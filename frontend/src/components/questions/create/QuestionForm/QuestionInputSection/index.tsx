import SelectTitle from "@/components/common/SelectTitle";
import QuestionInput from "./QuestionInput";
import QuestionList from "./QuestionList";
import useQuestionFormStore from "@/stores/useQuestionFormStore";

const QuestionInputSection = () => {
  const questionList = useQuestionFormStore((state) => state.questionList);

  return (
    <div className="flex flex-col">
      <div className="flex gap-1">
        <SelectTitle title="질문" />
        <span className="text-medium-r text-gray-500">
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
