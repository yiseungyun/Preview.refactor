import useQuestionFormStore from "@/stores/useQuestionFormStore";
import QuestionItem from "./QustionItem";

const QuestionList = () => {
  const questions = useQuestionFormStore((state) => state.questionList);

  return (
    <div className="flex flex-col gap-3">
      {questions.map((question) => (
        <QuestionItem key={question.id} content={question.content} />
      ))}
    </div>
  );
};

export default QuestionList;
