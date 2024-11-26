import fetchQuestion from "@/api/questions/getQuestion.ts";
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

export const useGetQuestion = (questionListId: string) => {
  return useQuery<ApiResponse>({
    queryKey: ["questions", questionListId],
    queryFn: () => fetchQuestion(Number(questionListId)),
  });
};
