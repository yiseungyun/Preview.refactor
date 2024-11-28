import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// 툴바에서 호스트만 사용가능 도구들 분리
interface HostOnlyToolsProps {
  isHost: boolean;
  isInProgress: boolean;
  stopStudySession: () => void;
  startStudySession: () => void;
  requestChangeIndex: (type: "next" | "prev") => void;
}
const HostOnlyTools = ({
  isHost,
  isInProgress,
  stopStudySession,
  startStudySession,
  requestChangeIndex,
}: HostOnlyToolsProps) => {
  return (
    isHost && (
      <>
        {isInProgress ? (
          <div className={"inline-flex gap-4 items-center mx-8"}>
            <button
              className={
                "bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
              }
              onClick={stopStudySession}
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
              onClick={startStudySession}
            >
              스터디 시작하기
            </button>
          </div>
        )}
        {isInProgress && (
          <div className={"study-toolbar inline-flex gap-4 items-center mx-8"}>
            <button
              onClick={() => requestChangeIndex("prev")}
              className={
                "inline-flex items-center bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
              }
              aria-label={"이전 질문 버튼"}
            >
              <FaAngleLeft /> 이전 질문
            </button>
            <button
              onClick={() => requestChangeIndex("next")}
              className={
                "inline-flex items-center bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs "
              }
              aria-label={"다음 질문 버튼"}
            >
              다음 질문 <FaAngleRight />
            </button>
          </div>
        )}
      </>
    )
  );
};

export default HostOnlyTools;
