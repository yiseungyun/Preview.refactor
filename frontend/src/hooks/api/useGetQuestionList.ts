import {
  getQuestionList,
  getQuestionListWithScrap,
} from "@/api/question-list/getQuestionList";
import { useQuery } from "@tanstack/react-query";

interface UseGetQuestionListProps {
  page?: number;
  limit?: number;
  category: string;
  tab: "ALL" | "SCRAP";
}

export const useQuestionList = ({
  page,
  limit,
  category = "전체",
  tab = "ALL",
}: UseGetQuestionListProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["questions", page, limit, category, tab],
    queryFn: () =>
      tab === "ALL"
        ? getQuestionList({ page, limit, category })
        : getQuestionListWithScrap({ page: page!, limit: limit || 12 }),
  });

  return {
    data,
    isLoading,
    error,
  };
};
