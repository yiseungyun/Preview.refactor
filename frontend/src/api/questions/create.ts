import axios from "axios";

interface QuestionListRequest {
  title: string;
  contents: string[];
  categoryNames: string[];
  isPublic: boolean;
}

export const createQuestionList = async (data: QuestionListRequest) => {
  const response = await axios.post("/api/question-list", data);

  return response.data;
};
