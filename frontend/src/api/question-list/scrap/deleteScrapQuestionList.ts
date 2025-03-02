import { api } from "@/api/config/axios";

export const deleteScrapQuestionList = async (id: number) => {
  const response = await api.delete(`/api/question-list/scrap/${id}`);
  return response.data.success;
};
