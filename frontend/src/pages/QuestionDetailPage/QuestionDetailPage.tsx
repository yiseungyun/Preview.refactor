import { useNavigate, useParams } from "react-router-dom";
import QuestionTitle from "@components/questions/detail/QuestionTitle.tsx";
import QuestionList from "@components/questions/detail/QuestionList.tsx";
import { useGetQuestionContent } from "@hooks/api/useGetQuestionContent.ts";
import ButtonSection from "@components/questions/detail/ButtonSection.tsx";
import { useEffect, useState } from "react";
import SidebarPageLayout from "@components/layout/SidebarPageLayout.tsx";
import { api } from "@/api/config/axios.ts";

const QuestionDetailPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [isScrapped, setIsScrapped] = useState(false);
  // TODO: isScrapped 상태를 서버에서 가져오는 로직이 추가되면 해당 로직을 추가

  const {
    data: question,
    isLoading,
    error,
  } = useGetQuestionContent(Number(questionId!));

  useEffect(() => {
    if (!questionId) {
      navigate("/questions");
    }
  }, [questionId, navigate]);

  if (isLoading) return <div>로딩 중</div>;
  if (error) return <div>에러가 발생</div>;
  if (!question) return null;

  const postScrapQuestionList = async (id: string) => {
    const response = await api.post("/api/question-list/scrap", {
      questionListId: id,
    });
    if (response.data.success) {
      setIsScrapped(true);
    }
  };

  const deleteScrapQuestionList = async (id: string) => {
    const response = await api.delete("/api/question-list/scrap", {
      data: {
        questionListId: id,
      },
    });
    if (response.data.success) {
      setIsScrapped(false);
    }
  };

  return (
    <SidebarPageLayout>
      <div className={"flex h-fit gap-8 max-w-7xl px-12 pt-20"}>
        <div
          className={
            "flex flex-col gap-4 w-47.5 p-8 bg-gray-white rounded-custom-l shadow-16"
          }
        >
          <QuestionTitle questionId={questionId!} />
          <QuestionList questionId={questionId!} />
          <ButtonSection
            isScrapped={isScrapped}
            scrapQuestionList={() => postScrapQuestionList(questionId!)}
            unScrapQuestionList={() => deleteScrapQuestionList(questionId!)}
          />
        </div>
      </div>
    </SidebarPageLayout>
  );
};

export default QuestionDetailPage;
