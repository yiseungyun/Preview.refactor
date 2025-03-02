import { useGetMyQuestionList } from "@/hooks/api/useGetMyQuestionList";
import QuestionItem from "@components/mypage/QuestionList/QuestionItem";
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
    <div className="my-4 w-full grid grid-cols-2 gap-3">
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
          <div className="col-span-2 flex items-center justify-center min-h-20">
            질문 목록이 비어있습니다
          </div>
        )}
    </div>
  );
};

export default QuestionList;
