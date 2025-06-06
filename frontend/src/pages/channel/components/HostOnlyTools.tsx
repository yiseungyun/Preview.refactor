import { useEffect, useState } from "react";
import ToolTip from "@/components/ToolTip";
import { useSessionStore } from "@/pages/channel/stores/useSessionStore";
import useStudyProgress from "@/pages/channel/hooks/useStudyProgress";
import { Socket } from "socket.io-client";
import { MdArrowBackIosNew, MdArrowForwardIos } from "@/components/Icons";

interface HostOnlyToolsProps {
  socket: Socket;
  disconnect: () => void;
}

const BUTTON_LOCKED_TIME_MS = 2000;
const studyButtonClass = "bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs";
const directionButtonClass = "relative inline-flex items-center bg-transparent rounded-full border-custom-s h-10 px-3 py-2 disabled:opacity-50 overflow-hidden";
const disabledClass = "origin-left absolute w-full h-full bg-gray-400/50 top-0 left-0 animate-progress";

const HostOnlyTools = ({ socket, disconnect }: HostOnlyToolsProps) => {
  const [buttonLocked, setButtonLocked] = useState(false);
  const { isHost, roomMetadata } = useSessionStore();
  const { requestChangeIndex, startStudySession, stopStudySession } = useStudyProgress({ socket, disconnect });
  const maxQuestionLength = roomMetadata.questionListContents.length;

  useEffect(() => {
    if (!buttonLocked) return;

    const timeout = setTimeout(() => {
      setButtonLocked(false);
    }, BUTTON_LOCKED_TIME_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [buttonLocked]);

  if (!isHost) {
    return null;
  }

  const handleChangeIndex = (type: "next" | "prev") => {
    requestChangeIndex(type);
    setButtonLocked(true);
  }

  return (
    <>
      <div className="inline-flex gap-4 items-center mx-8">
        {
          roomMetadata.inProgress ?
            <button
              className={studyButtonClass}
              onClick={stopStudySession}
            >
              스터디 종료하기
            </button>
            : <button
              className={studyButtonClass}
              onClick={startStudySession}
            >
              스터디 시작하기
            </button>
        }
      </div>
      {roomMetadata.inProgress && (
        <div className={"study-toolbar"}>
          <ToolTip text="이전 질문">
            <button
              onClick={() => handleChangeIndex("prev")}
              className={directionButtonClass}
              aria-label="이전 질문 버튼"
              disabled={buttonLocked || roomMetadata.currentIndex === 0}
            >
              <MdArrowBackIosNew />
              {buttonLocked && <div className={disabledClass} />}
            </button>
          </ToolTip>
          <ToolTip text="다음 질문">
            <button
              onClick={() => handleChangeIndex("next")}
              className={directionButtonClass}
              aria-label="다음 질문 버튼"
              disabled={buttonLocked || roomMetadata.currentIndex === maxQuestionLength - 1}
            >
              <MdArrowForwardIos />
              {buttonLocked && <div className={disabledClass} />}
            </button>
          </ToolTip>
        </div>
      )}
    </>
  )
};

export default HostOnlyTools;
