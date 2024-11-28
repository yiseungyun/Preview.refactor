import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import { sectionWithSidebar } from "@/constants/LayoutConstant.ts";
import QuestionTitle from "@/components/questions/detail/QuestionTitle.tsx";
import QuestionList from "@/components/questions/detail/QuestionList.tsx";
import { useGetQuestionContent } from "@/hooks/api/useGetQuestionContent";
import ButtonSection from "@/components/questions/detail/ButtonSection.tsx";
import { useEffect } from "react";

const QuestionDetailPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();

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

  return (
    <section className={`${sectionWithSidebar}`}>
      <Sidebar />
      <div className={"flex h-fit gap-8 max-w-7xl px-12 pt-20"}>
        <div
          className={
            "flex flex-col gap-4 w-47.5 p-8 bg-gray-white rounded-custom-l shadow-16"
          }
        >
          <QuestionTitle questionId={questionId!} />
          <QuestionList questionId={questionId!} />
          <ButtonSection />
        </div>
      </div>
    </section>
  );
};

export default QuestionDetailPage;
