interface QuestionListRequest {
  title: string,
  contents: string[],
  categoryNames: string[],
  isPublic: boolean
}

export const createQuestionList = async (data: QuestionListRequest) => {
  const response = await fetch('/api/question-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return response.json();
}