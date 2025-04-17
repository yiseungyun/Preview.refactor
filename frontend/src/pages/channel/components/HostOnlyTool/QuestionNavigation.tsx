import { MdArrowBackIosNew, MdArrowForwardIos } from "@/components/Icons";
import ToolTip from "@/components/ToolTip";
import useTemporarylock from "./useTemporarylock";
import { RoomMetadata } from "../../types/Channel";

interface QuestionNavigationProps {
  roomMetadata: RoomMetadata;
  requestChangeIndex: (type: "next" | "prev") => void;
}

const directionButtonClass = "relative inline-flex items-center bg-transparent rounded-full border-custom-s h-10 px-3 py-2 disabled:opacity-50 overflow-hidden";
const disabledClass = "origin-left absolute w-full h-full bg-gray-400/50 top-0 left-0 animate-progress";
const BUTTON_LOCKED_TIME_MS = 1000;

const QuestionNavigation = ({
  roomMetadata,
  requestChangeIndex
}: QuestionNavigationProps) => {
  const [buttonLocked, setButtonLocked] = useTemporarylock(false, BUTTON_LOCKED_TIME_MS);
  const maxQuestionLength = roomMetadata.questionListContents.length;

  const handleChangeIndex = (type: "next" | "prev") => {
    requestChangeIndex(type);
    setButtonLocked(true);
  }

  return (
    <>
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
    </>
  )
}

export default QuestionNavigation;