import useSessionFormStore from "../../../../../../stores/useSessionFormStore";
import { data } from "../data";
import QuestionItem from "./QuestionItem";

const QuestionList = () => {
  const { tab } = useSessionFormStore();

  return (
    <div className="mb-4">
      {data[tab].map((item, id) => {
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
