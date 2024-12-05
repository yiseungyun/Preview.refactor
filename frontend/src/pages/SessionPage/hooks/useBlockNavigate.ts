import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import useSocket from "@hooks/useSocket.ts";

const useBlockNavigate = () => {
  const shouldBlockRef = useRef<boolean>(true);
  const setShouldBlock = (state: boolean) => (shouldBlockRef.current = state);
  const { disconnect } = useSocket();

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return (
      shouldBlockRef.current &&
      currentLocation.pathname !== nextLocation.pathname
    );
  });

  useEffect(() => {
    if (shouldBlockRef.current && blocker.state === "blocked") {
      const confirmed = window.confirm(
        "정말 세션에서 나가시겠습니까? 변경사항이 저장되지 않을 수 있습니다."
      );

      if (confirmed) {
        blocker.proceed();
        disconnect();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  useEffect(() => {
    return () => {
      if (blocker) setShouldBlock(false);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return { setShouldBlock };
};

export default useBlockNavigate;
