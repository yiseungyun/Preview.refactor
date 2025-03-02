import getMyQuestionList from "@/api/question-list/getMyQuestionList";
import { useSuspenseQuery } from "@tanstack/react-query";

interface UseGetQuestionListProps {
  tab?: "myList" | "savedList";
  page?: number;
  limit: number;
}

export const useGetMyQuestionList = ({
  tab,
  page = 1,
  limit,
}: UseGetQuestionListProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ["myQuestions", tab, page, limit],
    queryFn: () => getMyQuestionList({ page, limit }),
  });

  return { data };
};
