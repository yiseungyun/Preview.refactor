import QuestionItem from "./QuestionItem";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";

interface QuestionList {
  id: number;
  title: string;
  contents: Question[];
  categoryNames: string[];
  isPublic: boolean;
  usage: number;
}

interface Question {
  id: number;
  content: string;
  index: number;
  questionListId: number;
}

interface QuestionItemProps {
  questionList: QuestionList[];
  questionLoading: boolean;
}

const QuestionList = ({ questionList, questionLoading }: QuestionItemProps) => {
  return (
    <div className="mb-4 h-80 overflow-y-auto">
      <LoadingIndicator loadingState={questionLoading} />
      {questionList?.map((item, id) => {
        return (
          <div key={id}>
            <QuestionItem item={item} />
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
