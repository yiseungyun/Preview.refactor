import useToastStore from "../stores/useToastStore.ts";
import { useCallback } from "react";

const useToast = () => {
  const { createToast, removeToast } = useToastStore();
  const DURATION = 5000;

  const toast = useCallback(
    (message: string, type: "success" | "error") => {
      const newToast = {
        id: new Date().getTime(),
        message,
        type,
        duration: DURATION || 5000,
      };

      createToast(newToast);
      setTimeout(() => removeToast(newToast.id), DURATION);
    },
    [createToast, removeToast]
  );

  const success = useCallback(
    (message: string) => {
      toast(message, "success");
    },
    [toast]
  );

  const error = useCallback(
    (message: string) => {
      toast(message, "error");
    },
    [toast]
  );

  return { success, error };
};

export default useToast;
