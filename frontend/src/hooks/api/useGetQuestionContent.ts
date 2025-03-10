import getQuestionContent from "@/api/question-list/getQuestionContent";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import useToast from "@hooks/useToast.ts";
import { isAxiosError } from "axios";
import { deleteScrapQuestionList } from "@/api/question-list/scrap/deleteScrapQuestionList";
import { postScrapQuestionList } from "@/api/question-list/scrap/editScrapQuestionList";

interface QuestionContent {
  id: number;
  content: string;
  index: number;
  questionListId: number;
}

interface ApiResponse {
  id: number;
  title: string;
  contents: QuestionContent[];
  categoryNames: string[];
  usage: number;
  username: string;
  isScrap?: boolean;
  scrapCount?: number;
}

export const useGetQuestionContent = (questionListId: number) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data } = useSuspenseQuery<ApiResponse>({
    queryKey: ["questions", questionListId],
    queryFn: () => getQuestionContent(questionListId),
    staleTime: 3000,
  });

  const { mutate: toggleScrap } = useMutation({
    mutationFn: (isCurrentlyScraped: boolean) =>
      isCurrentlyScraped
        ? deleteScrapQuestionList(questionListId)
        : postScrapQuestionList(questionListId),
    onMutate: async (isCurrentlyScraped) => {
      await queryClient.cancelQueries([
        "questions",
        questionListId,
      ] as QueryFilters);

      const previousData = queryClient.getQueryData<ApiResponse>([
        "questions",
        questionListId,
      ]);

      queryClient.setQueryData<ApiResponse>(
        ["questions", questionListId],
        (old) => ({
          ...old!,
          isScrap: !isCurrentlyScraped,
        })
      );

      return { previousData };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(
        ["questions", questionListId],
        context?.previousData
      );
      console.error("스크랩 실패:", error);
      if (
        isAxiosError(error) &&
        error?.response!.data.error === "Can't scrap my question list."
      ) {
        toast.error("자신이 작성한 질문지는 스크랩할 수 없습니다.");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries([
        "questions",
        questionListId,
      ] as QueryFilters);
    },
  });

  const handleToggleScrap = () => {
    if (!data) return;
    if (data.isScrap === null || data.isScrap === undefined) return;
    toggleScrap(data.isScrap);
  };

  return {
    data,
    toggleScrap: handleToggleScrap,
  };
};
