import { create } from "zustand";

interface QuestionState {
  category: string;
  questionTitle: string;
  access: "PRIVATE" | "PUBLIC";

  setCategory: (category: string) => void;
  setQuestionTitle: (name: string) => void;
  setAccess: (access: "PRIVATE" | "PUBLIC") => void;
  resetForm: () => void;
  isFormValid: () => boolean;
}

const initialState = {
  category: "",
  questionTitle: "",
  access: "PUBLIC" as const,
};

const useQuestionFormStore = create<QuestionState>((set, get) => ({
  ...initialState,

  setCategory: (category) => set({ category }),
  setQuestionTitle: (title) => set({ questionTitle: title }),
  setAccess: (access) => set({ access }),

  resetForm: () => set(initialState),
  isFormValid: () => {
    const state = get();
    return (
      state.category.trim() !== "" &&
      state.questionTitle.trim() !== ""
    );
  },
}));

export default useQuestionFormStore;
