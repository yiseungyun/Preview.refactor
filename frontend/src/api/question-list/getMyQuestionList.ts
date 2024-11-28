import axios from "axios";

interface QuestionListProps {
  page: number;
  limit: number;
}

const getMyQuestionList = async ({ page, limit }: QuestionListProps) => {
  const response = await axios.post("/api/question-list/my", {
    params: {
      page,
      limit,
    },
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.myQuestionLists;
};

export default getMyQuestionList;
