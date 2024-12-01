import { api } from "@/api/config/axios.ts";
import type { QuestionList } from "@/pages/QuestionListPage/types/QuestionList";

interface QuestionListProps {
  page?: number;
  limit?: number;
  categoryName?: string;
}

export const getQuestionList = async ({
  page,
  limit,
}: QuestionListProps): Promise<QuestionList[]> => {
  const response = await api.get("/api/question-list", {
    params: {
      page,
      limit,
    },
  });

  return response.data.data.allQuestionLists;
};

export const getQuestionListWithCategory = async ({
  categoryName,
  page,
  limit,
}: QuestionListProps): Promise<QuestionList[]> => {
  const response = await api.post(
    `/api/question-list/category`,
    {
      categoryName,
    },
    {
      params: {
        page,
        limit,
      },
    }
  );
  return response.data.data.allQuestionLists;
};
