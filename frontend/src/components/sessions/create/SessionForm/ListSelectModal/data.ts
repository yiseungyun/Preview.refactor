interface Question {
  id: number;
  question: string;
}

interface ListItem {
  title: string;
  count: number;
  isSelected: boolean;
  questions: Question[];
}

interface Data {
  myList: ListItem[];
  savedList: ListItem[];
}

export const data: Data = {
  myList: [{
    title: "프론트엔드 면접 질문이심",
    count: 2,
    isSelected: true,
    questions: [{
      id: 1,
      question: '클로저에 대해 설명해주세요.'
    }, {
      id: 2,
      question: '클로저에 대해 설명해주세요. 22'
    }]
  },
  {
    title: "프론트엔드 면접 질문이심",
    count: 10,
    isSelected: false,
    questions: [{
      id: 1,
      question: '클로저에 대해 설명해주세요.'
    }, {
      id: 2,
      question: '클로저에 대해 설명해주세요. 22'
    }]
  },
  {
    title: "프론트엔드 면접 질문이심",
    count: 10,
    isSelected: false,
    questions: [{
      id: 1,
      question: '클로저에 대해 설명해주세요.'
    }, {
      id: 2,
      question: '클로저에 대해 설명해주세요. 22'
    }]
  }],
  savedList: [{
    title: "백엔드 면접 질문이심",
    count: 10,
    isSelected: true,
    questions: [{
      id: 1,
      question: '클로저에 대해 설명해주세요.'
    }, {
      id: 2,
      question: '클로저에 대해 설명해주세요. 22'
    }]
  }, {
    title: "백엔드 면접 질문이심",
    count: 3,
    isSelected: false,
    questions: [{
      id: 1,
      question: '클로저에 대해 설명해주세요.'
    }, {
      id: 2,
      question: '클로저에 대해 설명해주세요. 22'
    }, {
      id: 3,
      question: '클로저에 대해 설명해주세요. 33'
    }]
  }]
};