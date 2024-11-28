import axios from "axios";

interface QuestionListProps {
  page: number;
  limit: number;
}

export const getQuestionList = async ({ page, limit }: QuestionListProps) => {
  const response = await axios.get("/api/question-list", {
    params: {
      page,
      limit,
    },
  });

  return response.data.data.allQuestionLists;
};
