import QuestionItem from "./QuestionItem";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";

interface QuestionList {
  id: number;
  title: string;
  usage: number;
  isStarred?: boolean;
  questionCount: number;
  categoryNames: string[];
}

const QuestionList = () => {
  const [questionList, setQuestionList] = useState<QuestionList[]>([]);
  const [questionLoading, setQuestionLoading] = useState(true);

  useEffect(() => {
    getQuestionList();
  }, []);

  const getQuestionList = async () => {
    try {
      const response = await axios.get("/api/question-list");
      const data = response.data.data.allQuestionLists ?? [];
      setQuestionList(data);
      setQuestionLoading(false);
    } catch (error) {
      console.error("질문지 리스트 불러오기 실패", error);
      setQuestionList([]);
    }
  };
  // const { tab } = useSessionFormStore();

  return (
    <div className="mb-4">
      <LoadingIndicator loadingState={questionLoading} />
      {/*{data[tab].map((item, id) => {*/}
      {/*  return (*/}
      {/*    <div key={id}>*/}
      {/*      <QuestionItem item={item} />*/}
      {/*    </div>*/}
      {/*  );*/}
      {/*})}*/}
      {questionList.map((item, id) => {
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
