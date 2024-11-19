import useQuestionFormStore from "@/stores/useQuestionFormStore";
import QuestionItem from "./QustionItem";

const QuestionList = () => {
  const questions = useQuestionFormStore((state) => state.questionList);

  return (
    <div className="flex flex-col gap-3">
      {questions.map((question, index) => (
        <QuestionItem key={index} content={question} />
      ))}
    </div>
  );
};

export default QuestionList;
