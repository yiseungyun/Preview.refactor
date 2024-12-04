import getMyQuestionList from "@/api/question-list/getMyQuestionList";
import { useQuery } from "@tanstack/react-query";

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
  const { data, isLoading, error } = useQuery({
    queryKey: ["myQuestions", tab, page, limit],
    queryFn: () => getMyQuestionList({ page, limit }),
  });

  return {
    data,
    isLoading,
    error,
  };
};
