import axios from "axios";

interface QuestionListRequest {
  title: string,
  contents: string[],
  categoryNames: string[],
  isPublic: boolean
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createQuestionList = async (data: QuestionListRequest) => {
  const response = await axios.post(
    `${BASE_URL}/api/question-list`,
    data
  );

  return response.data;
};