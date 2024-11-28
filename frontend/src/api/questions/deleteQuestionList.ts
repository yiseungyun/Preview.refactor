import axios from "axios";

export const deleteQuestionList = async (questionListId: number) => {
  const response = await axios.delete(`api/question-list/${questionListId}`);

  return response.data;
};
