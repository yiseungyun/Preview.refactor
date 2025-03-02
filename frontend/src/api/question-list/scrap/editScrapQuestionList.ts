import { api } from "@/api/config/axios";

export const postScrapQuestionList = async (id: number) => {
  const response = await api.post("/api/question-list/scrap", {
    questionListId: id,
  });
  return response.data.success;
};