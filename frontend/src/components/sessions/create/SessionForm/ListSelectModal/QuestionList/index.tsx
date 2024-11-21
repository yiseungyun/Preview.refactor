import useSessionFormStore from "@/stores/useSessionFormStore";
import { data } from "../data";
import QuestionItem from "./QuestionItem";
import { QUESTION_PER_PAGE } from "../constant";

const QuestionList = ({ page }: { page: number }) => {
  const { tab } = useSessionFormStore();

  const startIndex = (page - 1) * QUESTION_PER_PAGE;
  const endIndex = startIndex + QUESTION_PER_PAGE;

  return (
    <div className="mb-4 h-80 overflow-y-auto">
      {data[tab].slice(startIndex, endIndex).map((item, id) => (
        <div key={id}>
          <QuestionItem item={item} />
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
