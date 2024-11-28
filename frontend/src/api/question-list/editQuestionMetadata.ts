import axios from "axios";

interface QuestionMetadataRequest {
  title?: string;
  categoryNames?: string[];
  isPublic?: boolean;
}

export const editQuestionMetadata = async (
  questionListId: string,
  data: QuestionMetadataRequest
) => {
  const response = await axios.patch(
    `/api/question-list/${questionListId}`,
    data
  );

  return response.data;
};
