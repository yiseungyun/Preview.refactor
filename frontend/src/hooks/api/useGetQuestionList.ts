import {
  getQuestionList,
  getQuestionListWithCategory,
} from "@/api/question-list/getQuestionList";
import { useQuery } from "@tanstack/react-query";

interface UseGetQuestionListProps {
  page?: number;
  limit?: number;
  category: string;
}

export const useQuestionList = ({
  page,
  limit,
  category = "전체",
}: UseGetQuestionListProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["questions", page, limit, category],
    queryFn: () =>
      category !== "전체"
        ? getQuestionListWithCategory({ categoryName: category, page, limit })
        : getQuestionList({ page, limit }),
  });

  return {
    data,
    isLoading,
    error,
  };
};
