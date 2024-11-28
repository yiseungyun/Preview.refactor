import axios from "axios";

interface QuestionListProps {
  page: number;
  limit: number;
}

const getScrapQuestionList = async ({ page, limit }: QuestionListProps) => {
  const response = await axios.post("/api/question-list/scrap", {
    params: {
      page,
      limit,
    },
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.questionLists;
};

export default getScrapQuestionList;
