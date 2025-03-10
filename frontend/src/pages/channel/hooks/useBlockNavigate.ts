import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

const useBlockNavigate = (disconnect: () => void) => {
  const shouldBlockRef = useRef<boolean>(true);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return (
      shouldBlockRef.current &&
      currentLocation.pathname !== nextLocation.pathname
    );
  });

  useEffect(() => {
    if (shouldBlockRef.current && blocker.state === "blocked") {
      const confirmed = window.confirm("정말 채널에서 나가시겠습니까? 변경사항이 저장되지 않을 수 있습니다.");

      if (confirmed) {
        blocker.proceed();
        disconnect();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      shouldBlockRef.current = false;
    };
  }, []);

  const setShouldBlock = useCallback((state: boolean) => {
    shouldBlockRef.current = state;
  }, []);

  return { setShouldBlock };
};

export default useBlockNavigate;
