import { useNavigate, useParams } from "react-router-dom";
import QuestionTitle from "./components/QuestionTitle.tsx";
import QuestionList from "./components/QuestionList.tsx";
import { useGetQuestionContent } from "@hooks/api/useGetQuestionContent.ts";
import ButtonSection from "./components/ButtonSection.tsx";
import { useEffect } from "react";
import useToast from "@hooks/useToast.ts";

const QuestionDetailPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();

  const {
    data: question,
    toggleScrap,
  } = useGetQuestionContent(Number(questionId!));
  // TODO: isScrapped 상태를 서버에서 가져오는 로직이 추가되면 해당 로직을 추가
  const toast = useToast();

  useEffect(() => {
    if (!questionId) {
      navigate("/questions");
    }
  }, [questionId]);

  const shareQuestionList = () => {
    if (question) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(`${question.title} 링크가 복사되었습니다.`);
    }
  };

  return (
    <div className="flex h-fit gap-8 max-w-7xl px-12 pt-20">
      <div className="flex flex-col gap-4 w-47.5 p-8 bg-gray-white rounded-custom-l shadow-16 mb-8">
        <QuestionTitle questionId={questionId!} />
        <QuestionList questionId={questionId!} />
        {question && (
          <ButtonSection
            isScrapped={question.isScrap ?? false}
            scrapQuestionList={toggleScrap}
            unScrapQuestionList={toggleScrap}
            shareQuestionList={shareQuestionList}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
