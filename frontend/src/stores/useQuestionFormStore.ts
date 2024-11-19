import { create } from "zustand";

interface QuestionState {
  category: string;
  questionTitle: string;
  access: "PRIVATE" | "PUBLIC";
  questionList: string[];

  setCategory: (category: string) => void;
  setQuestionTitle: (name: string) => void;
  setAccess: (access: "PRIVATE" | "PUBLIC") => void;
  addQuestion: (question: string) => void;
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
  addQuestion: (question: string) =>
    set((state) => {
      const currentQuestions = state.questionList;
      if (currentQuestions.length < 20) {
        return { questionList: [...currentQuestions, question] };
      }
      return state;
    }),

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
