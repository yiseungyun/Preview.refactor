import getQuestionContent from "@/api/question-list/getQuestionContent";
import {
  QueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteScrapQuestionList,
  postScrapQuestionList,
} from "@/pages/QuestionDetailPage/api/scrapAPI.ts";
import useToast from "@hooks/useToast.ts";
import { isAxiosError } from "axios";

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
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["questions", questionListId],
    queryFn: () => getQuestionContent(questionListId),
    staleTime: 0,
  });

  // 스크랩 토글 뮤테이션
  const { mutate: toggleScrap } = useMutation({
    mutationFn: (isCurrentlyScraped: boolean) =>
      isCurrentlyScraped
        ? deleteScrapQuestionList(questionListId)
        : postScrapQuestionList(questionListId),
    onMutate: async (isCurrentlyScraped) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries([
        "questions",
        questionListId,
      ] as QueryFilters);

      // 이전 데이터 저장
      const previousData = queryClient.getQueryData<ApiResponse>([
        "questions",
        questionListId,
      ]);

      // 낙관적 업데이트
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
      // 에러시 롤백
      queryClient.setQueryData(
        ["questions", questionListId],
        context?.previousData
      );
      console.error("스크랩 토글 실패:", error);
      if (
        isAxiosError(error) &&
        error?.response!.data.error === "Can't scrap my question list."
      ) {
        toast.error("자신이 작성한 질문지는 스크랩할 수 없습니다.");
      }
    },
    onSettled: () => {
      // 쿼리 무효화 및 리페치
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
    isLoading,
    error,
    toggleScrap: handleToggleScrap,
  };
};
