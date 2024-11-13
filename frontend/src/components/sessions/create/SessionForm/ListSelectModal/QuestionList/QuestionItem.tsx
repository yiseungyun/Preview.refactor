import { GrDown, GrUp } from "react-icons/gr";
import { ImCheckmark } from "react-icons/im";
import useSessionFormStore from "@/stores/useSessionFormStore";

interface Question {
  id: number;
  question: string;
}

interface ListItem {
  id: number;
  user_name: string;
  category: string;
  title: string;
  count: number;
  questions: Question[];
}

const QuestionItem = ({ item }: { item: ListItem }) => {
  const {
    questionId,
    selectedOpenId,
    setQuestionId,
    setQuestionTitle,
    setSelectedOpenId,
  } = useSessionFormStore();

  const checkHandler = (id: number, title: string) => {
    setQuestionId(id);
    setQuestionTitle(title);
  };

  const openHandler = (id: number) => {
    if (selectedOpenId === id) {
      setSelectedOpenId(-1);
    } else {
      setSelectedOpenId(id);
    }
  };

  const isSelected = questionId === item.id;
  const isListOpen = selectedOpenId === item.id;

  return (
    <>
      <div className="flex flex-row items-center w-full h-20 border-t-custom-s px-8 py-4">
        <button
          className="mr-6"
          onClick={() => {
            openHandler(item.id);
          }}
        >
          {isListOpen ? (
            <GrUp className="w-5 h-5 text-gray-600" />
          ) : (
            <GrDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <div>
          <div className="flex gap-3">
            <div>{item.category}</div>
            <span className="text-medium-s text-gray-600">
              {item.user_name} • {item.count}개의 질문
            </span>
          </div>
          <p className="text-semibold-r text-gray-black">{item.title}</p>
        </div>
        <button
          className={`flex items-center ml-auto w-10 h-10 rounded-custom-m
            ${isSelected
              ? "bg-green-200 text-green-50"
              : "bg-gray-300 text-gray-50"
            }`}
          onClick={() => checkHandler(item.id, item.title)}
        >
          <ImCheckmark className="m-auto w-5 h-5" />
        </button>
      </div>
      {isListOpen ? (
        <div className="bg-gray-50 px-20 py-5">
          {item.questions.map((item) => {
            return (
              <p key={item.id} className="text-medium-r text-gray-600">
                {item.question}
              </p>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default QuestionItem;
