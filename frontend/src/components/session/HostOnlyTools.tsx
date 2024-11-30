import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from "react";

// 툴바에서 호스트만 사용가능 도구들 분리
interface HostOnlyToolsProps {
  isHost: boolean;
  isInProgress: boolean;
  stopStudySession: () => void;
  startStudySession: () => void;
  requestChangeIndex: (type: "next" | "prev") => void;
  currentIndex: number;
  maxQuestionLength: number;
}
const HostOnlyTools = ({
  isHost,
  isInProgress,
  stopStudySession,
  startStudySession,
  requestChangeIndex,
  currentIndex,
  maxQuestionLength,
}: HostOnlyToolsProps) => {
  const [changeCooldown, setChangeCooldown] = useState(false);
  const COOLDOWN_TIME = 2000;

  useEffect(() => {
    if (!changeCooldown) return;

    const timeout = setTimeout(() => {
      setChangeCooldown(false);
    }, COOLDOWN_TIME);

    return () => {
      clearTimeout(timeout);
    };
  }, [changeCooldown]);

  return (
    isHost && (
      <>
        {isInProgress ? (
          <div className={"inline-flex gap-4 items-center mx-8"}>
            <button
              className={
                "bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
              }
              onClick={() => {
                stopStudySession();
              }}
            >
              스터디 종료하기
            </button>
          </div>
        ) : (
          <div className={"inline-flex gap-4 items-center mx-8"}>
            <button
              className={
                "bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
              }
              onClick={() => {
                startStudySession();
              }}
            >
              스터디 시작하기
            </button>
          </div>
        )}
        {isInProgress && (
          <div className={"study-toolbar inline-flex gap-4 items-center mx-8"}>
            <button
              onClick={() => {
                requestChangeIndex("prev");
                setChangeCooldown(true);
              }}
              className={
                "relative inline-flex items-center bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs disabled:opacity-50 overflow-hidden"
              }
              aria-label={"이전 질문 버튼"}
              disabled={changeCooldown || currentIndex === 0}
            >
              <FaAngleLeft /> 이전 질문
              {changeCooldown && (
                <div
                  className={
                    "origin-left absolute w-full h-full bg-gray-400/50 top-0 left-0 animate-progress"
                  }
                ></div>
              )}
            </button>
            <button
              onClick={() => {
                requestChangeIndex("next");
                setChangeCooldown(true);
              }}
              className={
                "relative inline-flex items-center bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs disabled:opacity-50 overflow-hidden"
              }
              aria-label={"다음 질문 버튼"}
              disabled={
                changeCooldown || currentIndex === maxQuestionLength - 1
              }
            >
              다음 질문 <FaAngleRight />
              {changeCooldown && (
                <div
                  className={
                    "origin-left absolute w-full h-full bg-gray-400/50 top-0 left-0 animate-progress"
                  }
                ></div>
              )}
            </button>
          </div>
        )}
      </>
    )
  );
};

export default HostOnlyTools;
