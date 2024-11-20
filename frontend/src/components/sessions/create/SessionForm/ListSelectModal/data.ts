interface Question {
  id: number;
  question: string;
}

interface ListItem {
  id: number;
  user_name: string;
  category: string;
  title: string;
  count: number;
  questions: Question[];
}

interface Data {
  myList: ListItem[];
  savedList: ListItem[];
}

export const data: Data = {
  myList: [
    {
      id: 1,
      user_name: "네모정",
      category: "프론트엔드",
      title: "프론트엔드 면접 질문이심1",
      count: 2,
      questions: [
        {
          id: 3,
          question: "클로저에 대해 설명해주세요.",
        },
        {
          id: 4,
          question: "클로저에 대해 설명해주세요. 22",
        },
      ],
    },
    {
      id: 2,
      user_name: "승윤최고",
      category: "프론트엔드",
      title: "프론트엔드 면접 질문이심2",
      count: 10,
      questions: [
        {
          id: 5,
          question: "클로저에 대해 설명해주세요.",
        },
        {
          id: 6,
          question: "클로저에 대해 설명해주세요. 22",
        },
      ],
    },
    {
      id: 3,
      user_name: "사용자",
      category: "프론트엔드",
      title: "프론트엔드 면접 질문이심3",
      count: 10,
      questions: [
        {
          id: 7,
          question: "클로저에 대해 설명해주세요.",
        },
        {
          id: 8,
          question: "클로저에 대해 설명해주세요. 22",
        },
      ],
    },
    {
      id: 4,
      user_name: "사용자",
      category: "프론트엔드",
      title: "프론트엔드 면접 질문이심3",
      count: 10,
      questions: [
        {
          id: 123,
          question: "클로저에 대해 설명해주세요.",
        },
        {
          id: 1231,
          question: "클로저에 대해 설명해주세요. 22",
        },
      ],
    },
  ],
  savedList: [
    {
      id: 4,
      user_name: "사용자",
      category: "프론트엔드",
      title: "백엔드 면접 질문이심1",
      count: 10,
      questions: [
        {
          id: 9,
          question: "클로저에 대해 설명해주세요.",
        },
        {
          id: 10,
          question: "클로저에 대해 설명해주세요. 22",
        },
      ],
    },
    {
      id: 5,
      user_name: "사용자",
      category: "프론트엔드",
      title: "백엔드 면접 질문이심2",
      count: 3,
      questions: [
        {
          id: 11,
          question: "클로저에 대해 설명해주세요.",
        },
        {
          id: 12,
          question: "클로저에 대해 설명해주세요. 22",
        },
        {
          id: 13,
          question: "클로저에 대해 설명해주세요. 33",
        },
      ],
    },
  ],
};
