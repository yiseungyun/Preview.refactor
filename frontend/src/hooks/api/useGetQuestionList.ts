import { getQuestionList } from "@/api/question-list/getQuestionList";
import { useQuery } from "@tanstack/react-query";

interface UseGetQuestionListProps {
  page: number;
  limit: number;
}

export const useCreateQuestionList = ({
  page,
  limit,
}: UseGetQuestionListProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["questions", page, limit],
    queryFn: () => getQuestionList({ page, limit }),
  });

  return {
    questions: data,
    isLoading,
    error,
  };
};
