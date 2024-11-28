import { useMutation } from "@tanstack/react-query";
import { createQuestionList } from "@/api/question-list/createQuestionList";
import useToast from "@hooks/useToast.ts";
import { useNavigate } from "react-router-dom";

interface QuestionListRequest {
  title: string;
  contents: string[];
  categoryNames: string[];
  isPublic: boolean;
}

export const useCreateQuestionList = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { mutate: createQuestions } = useMutation({
    mutationFn: (data: QuestionListRequest) => createQuestionList(data),
    onSuccess: (response) => {
      const questionListId = response.data.createdQuestionList.id;
      toast.success("질문지 생성에 성공했습니다.");
      navigate(`/questions/${questionListId}`);
    },
    onError: () => {
      toast.error("질문지 생성에 실패했습니다.");
    },
  });

  return createQuestions;
};
