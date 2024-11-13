import { create } from "zustand";

interface SessionFormState {
  category: string;
  sessionName: string;
  questionId: number;
  participant: 1 | 2 | 3 | 4 | 5;
  access: "private" | "public";
  tab: "myList" | "savedList";
  selectedOpenId: number;

  setCategory: (category: string) => void;
  setSessionName: (name: string) => void;
  setQuestionId: (id: number) => void;
  setParticipant: (count: 1 | 2 | 3 | 4 | 5) => void;
  setAccess: (access: "private" | "public") => void;
  setTab: (tab: "myList" | "savedList") => void;
  setSelectedOpenId: (selectedOpenId: number) => void;
  resetForm: () => void;
}

const initialState = {
  category: "",
  sessionName: "",
  questionId: -1,
  participant: 1 as const,
  access: "public" as const,
  tab: "myList" as const,
  selectedOpenId: -1
};

const useSessionFormStore = create<SessionFormState>((set) => ({
  ...initialState,

  setCategory: (category) => set({ category }),
  setSessionName: (sessionName) => set({ sessionName }),
  setQuestionId: (questionId) => set({ questionId }),
  setParticipant: (participant) => set({ participant }),
  setAccess: (access) => set({ access }),
  setTab: (tab) => set({ tab }),
  setSelectedOpenId: (selectedOpenId) => set({ selectedOpenId }),
  resetForm: () => set(initialState),
}));

export default useSessionFormStore;
