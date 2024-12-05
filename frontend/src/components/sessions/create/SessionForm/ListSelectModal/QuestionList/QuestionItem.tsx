import { GrDown, GrUp } from "react-icons/gr";
import { ImCheckmark } from "react-icons/im";
import useSessionFormStore from "@/pages/CreateSessionPage/stores/useSessionFormStore";
import { useState } from "react";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { api } from "@/api/config/axios.ts";
import { FaUsers } from "react-icons/fa6";

interface Question {
  id: number;
  content: string;
  index: number;
  questionListId: number;
}
interface QuestionsMap {
  [key: number]: Question[];
}

interface QuestionList {
  id: number;
  title: string;
  usage: number;
  isStarred?: boolean;
  questionCount?: number;
  categoryNames?: string[];
}

const QuestionItem = ({ item }: { item: QuestionList }) => {
  const {
    questionId,
    selectedOpenId,
    setQuestionId,
    setQuestionTitle,
    setSelectedOpenId,
  } = useSessionFormStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionLoading, setQuestionLoading] = useState(true);
  const isSelected = questionId === item.id;
  const isListOpen = selectedOpenId === item.id;

  const [questionMap, setQuestionMap] = useState<QuestionsMap>({});

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

    if (questionMap[id]) {
      setQuestions(questionMap[id]);
    } else {
      getQuestionListDetail();
    }
  };

  const getQuestionListDetail = async () => {
    try {
      setQuestionLoading(true);
      const response = await api.post(`/api/question-list/contents`, {
        questionListId: item.id,
      });
      const questionsData: Question[] =
        response.data.data.questionListContents.contents;
      setQuestionMap({ ...questionMap, [item.id]: questionsData });
      setQuestions(questionsData);
      setQuestionLoading(false);
    } catch (e) {
      console.error("질문지 리스트 디테일 불러오기 실패", e);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center w-full h-20 border-t-custom-s px-8 py-4">
        <button
          className="mr-6 hover:bg-gray-200 p-1 rounded-md"
          onClick={() => {
            openHandler(item.id);
          }}
        >
          {isListOpen ? (
            <GrUp className="w-5 h-5 text-gray-600 " />
          ) : (
            <GrDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <div>
          <div className="flex items-center leading-5 gap-3  mb-1">
            <div
              className={
                "text-medium-s bg-green-100 bg-opacity-30 rounded-md px-2 text-white"
              }
            >
              {item.categoryNames ? item.categoryNames[0]! : "미분류"}
            </div>
            <span className="inline-flex items-center gap-1 leading-5 text-medium-s text-gray-600">
              <FaUsers /> {item.usage}
            </span>
          </div>
          <p className="text-semibold-r text-gray-black">{item.title}</p>
        </div>
        <button
          className={`flex items-center ml-auto w-10 h-10 rounded-custom-m
            ${
              isSelected
                ? "bg-green-200 text-green-50"
                : "bg-gray-300 text-gray-50"
            }`}
          onClick={() => {
            checkHandler(item.id, item.title);
          }}
        >
          <ImCheckmark className="m-auto w-5 h-5" />
        </button>
      </div>
      {isListOpen ? (
        <div className="bg-gray-50 px-20 py-5 transition-all">
          <div className={"h-fit"}>
            <LoadingIndicator loadingState={questionLoading} />
          </div>
          {questions.map((item, index) => {
            return (
              <p key={item.id} className="text-medium-r p-0.5 text-gray-600">
                Q{index + 1}. {item.content}
              </p>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default QuestionItem;
