import getScrapQuestionList from "@/api/question-list/getScrapQuestionList";
import { useQuery } from "@tanstack/react-query";

interface UseGetQuestionListProps {
  page?: number;
  limit: number;
}

export const useGetScrapQuestionList = ({
  page = 1,
  limit,
}: UseGetQuestionListProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["scrapQuestions", page, limit],
    queryFn: () => getScrapQuestionList({ page, limit }),
  });

  return {
    data,
    isLoading,
    error,
  };
};
