import axios from "axios";

const getQuestionContent = async (questionListId: number) => {
  const response = await axios.post("/api/question-list/contents", {
    questionListId,
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data.questionListContents;
};

export default getQuestionContent;
