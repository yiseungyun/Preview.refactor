import { create } from "zustand";

interface Question {
  id: string;
  content: string;
}

interface QuestionState {
  category: string;
  questionTitle: string;
  access: "PRIVATE" | "PUBLIC";
  questionList: Question[];

  setCategory: (category: string) => void;
  setQuestionTitle: (name: string) => void;
  setAccess: (access: "PRIVATE" | "PUBLIC") => void;
  addQuestion: (content: string) => void;
  deleteQuestion: (id: string) => void;
  updateQuestion: (id: string, newContent: string) => void;
  resetForm: () => void;
  isFormValid: () => boolean;
}

const initialState = {
  category: "",
  questionTitle: "",
  access: "PUBLIC" as const,
  questionList: [],
};

const useQuestionFormStore = create<QuestionState>((set, get) => ({
  ...initialState,

  setCategory: (category) => set({ category }),
  setQuestionTitle: (title) => set({ questionTitle: title }),
  setAccess: (access) => set({ access }),

  addQuestion: (content: string) =>
    set((state) => {
      const currentQuestions = state.questionList;
      if (currentQuestions.length < 20) {
        const newQuestion: Question = {
          id: crypto.randomUUID(),
          content,
        };
        return { questionList: [...currentQuestions, newQuestion] };
      }
      return state;
    }),

  deleteQuestion: (id: string) =>
    set((state) => ({
      questionList: state.questionList.filter((question) => question.id !== id),
    })),

  updateQuestion: (id: string, newContent: string) =>
    set((state) => ({
      questionList: state.questionList.map((question) =>
        question.id === id ? { ...question, content: newContent } : question
      ),
    })),

  resetForm: () => set(initialState),
  isFormValid: () => {
    const state = get();
    return (
      state.category.trim() !== "" &&
      state.questionTitle.trim() !== "" &&
      state.questionTitle.trim().length >= 5 &&
      state.questionList.length >= 5
    );
  },
}));

export default useQuestionFormStore;
