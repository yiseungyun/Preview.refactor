import useToast from "../useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuestionList } from "@/api/questions/deleteQuestionList";

interface UseDeleteQuestionList {
  page: Number;
  limit: Number;
}

export const useDeleteQuesitonList = ({
  page,
  limit,
}: UseDeleteQuestionList) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutate: deleteQuestions } = useMutation({
    mutationFn: deleteQuestionList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", page, limit],
      });
    },
    onError: () => {
      toast.error("질문지 삭제에 실패했습니다.");
    },
  });

  return deleteQuestions;
};
