import { useCallback, useEffect } from "react";
import { BlockerFunction, useBlocker } from "react-router-dom";
import useSocket from "@hooks/useSocket.ts";

const useBlockNavigate = () => {
  const shouldBlock = true;
  const { disconnect } = useSocket();

  const blocker = useBlocker(
    useCallback<BlockerFunction>(
      ({ currentLocation, nextLocation }) => {
        return (
          shouldBlock && currentLocation.pathname !== nextLocation.pathname
        );
      },
      [shouldBlock]
    )
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
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
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

export default useBlockNavigate;
