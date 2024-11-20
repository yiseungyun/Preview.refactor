import useSessionFormStore from "@/stores/useSessionFormStore";
import { data } from "../data";
import QuestionItem from "./QuestionItem";

const QuestionList = () => {
  const { tab } = useSessionFormStore();

  return (
    <div className="mb-4 h-80 overflow-y-auto">
      {data[tab].map((item, id) => {
        // 한 페이지 당 4개 정도
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
