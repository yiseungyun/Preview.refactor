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
      console.log(response);
      const data = response.data.data.allQuestionLists ?? [];
      setQuestionList(data);
      setQuestionLoading(false);
    } catch (error) {
      console.error("질문지 리스트 불러오기 실패", error);
      const questionLists = [
        {
          id: 1,
          title: "프론트엔드 기술 면접",
          questionCount: 25,
          usage: 128,
          isStarred: true,
          categoryNames: ["Frontend"],
        },
        {
          id: 2,
          title: "요청에 실패해서 더미 데이터입니다.",
          questionCount: 30,
          usage: 89,
          isStarred: false,
          categoryNames: ["React"],
        },
        {
          id: 3,
          title: "JavaScript 핵심 개념",
          questionCount: 40,
          usage: 156,
          isStarred: true,
          categoryNames: ["JavaScript"],
        },
      ];
      setQuestionList(questionLists);
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
