import axios from "axios";

const fetchQuestionContent = async (questionListId: number) => {
  const { data } = await axios.post("/api/question-list/contents", {
    questionListId,
  });

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data.questionListContents;
};

export default fetchQuestionContent;
