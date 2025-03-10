import { createContext, useContext } from "react";
import { TabContextType } from "./type";

export const TabContext = createContext<TabContextType | null>(null);

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext는 TabProvider 내부에서 사용되어야 합니다.");
  }
  return context;
}