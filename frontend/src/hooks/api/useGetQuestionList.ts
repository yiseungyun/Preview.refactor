import {
  getQuestionList,
  getQuestionListWithScrap,
} from "@/api/question-list/getQuestionList";
import { useSuspenseQuery } from "@tanstack/react-query";

interface UseGetQuestionListProps {
  page?: number;
  limit?: number;
  category: string;
  tab: "ALL" | "SCRAP";
}

export const useGetQuestionList = ({
  page,
  limit,
  category = "전체",
  tab = "ALL",
}: UseGetQuestionListProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ["questions", page, limit, category, tab],
    queryFn: () =>
      tab === "ALL"
        ? getQuestionList({ page, limit, category })
        : getQuestionListWithScrap({ page, limit: limit || 12 }),
  });

  return { data };
};
