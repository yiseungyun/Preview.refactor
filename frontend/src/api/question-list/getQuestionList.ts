import { api } from "@/api/config/axios.ts";
import type { QuestionList } from "@/pages/QuestionListPage/types/QuestionList";

interface QuestionListProps {
  page?: number;
  limit?: number;
  category?: string;
}

interface QuestionListResponse {
  allQuestionLists?: QuestionList[];
  questionList?: QuestionList[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: string;
  };
}

export const getQuestionList = async ({
  category,
  page,
  limit,
}: QuestionListProps): Promise<QuestionListResponse> => {
  const response = await api.get("/api/question-list", {
    params: {
      page,
      limit,
      category: category === "전체" ? "" : category,
    },
  });

  return response.data.data;
};

export const getQuestionListWithScrap = async ({
  page,
  limit,
}: QuestionListProps): Promise<QuestionListResponse> => {
  const response = await api.get("/api/question-list/scrap", {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
};
