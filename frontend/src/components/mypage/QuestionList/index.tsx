import { useGetMyQuestionList } from "@/hooks/api/useGetMyQuestionList";
import QuestionItem from "@/components/mypage/QuestionList/QuestionItem";
import { useGetScrapQuestionList } from "@/hooks/api/useGetScrapQuestionList";

interface ListProps {
  tab: "myList" | "savedList";
  page: number;
}

const QuestionList = ({ tab, page }: ListProps) => {
  const { data: myData } = useGetMyQuestionList({ page, limit: 8 });
  const { data: scrapData } = useGetScrapQuestionList({ page, limit: 8 });

  const currentQuestionList = tab === "myList" ? myData?.myQuestionLists : scrapData?.questionList;

  return (
    <div className="my-4 w-full h-68 grid grid-cols-2 xl:grid-cols-3 gap-4">
      {
        currentQuestionList && currentQuestionList.length > 0 ? (
          currentQuestionList.map((question) => (
            <QuestionItem
              key={question.id}
              questionListId={question.id}
              type={tab === "myList" ? "my" : "saved"}
              page={page}
            />
          ))
        ) : (
          <p>질문 목록이 비어있습니다</p>
        )}
    </div>
  );
};

export default QuestionList;
