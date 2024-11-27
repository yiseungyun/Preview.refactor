import fetchQuestion from "@/api/questions/getQuestionContent";
import { useQuery } from "@tanstack/react-query";

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
}

export const useGetQuestionContent = (questionListId: string) => {
  return useQuery<ApiResponse>({
    queryKey: ["questions", questionListId],
    queryFn: () => fetchQuestion(Number(questionListId)),
  });
};
