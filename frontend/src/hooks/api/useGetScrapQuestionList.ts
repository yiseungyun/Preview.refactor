import getScrapQuestionList from "@/api/question-list/scrap/getScrapQuestionList";
import { useSuspenseQuery } from "@tanstack/react-query";

interface UseGetQuestionListProps {
  page?: number;
  limit: number;
}

export const useGetScrapQuestionList = ({
  page = 1,
  limit,
}: UseGetQuestionListProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ["scrapQuestions", page, limit],
    queryFn: () => getScrapQuestionList({ page, limit }),
  });

  return { data };
};
