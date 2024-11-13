import { create } from "zustand";

interface SessionFormState {
  category: string;
  sessionName: string;
  questionId: number;
  participant: 1 | 2 | 3 | 4 | 5;
  access: "private" | "public";
}

const useSessionFormStore = create<SessionFormState>((set) => ({
  category: "",
  sessionName: "",
  questionId: -1,
  participant: 1,
  access: "public",


}));

export default useSessionFormStore;
