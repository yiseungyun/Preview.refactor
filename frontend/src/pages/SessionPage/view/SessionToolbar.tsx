import HostOnlyTools from "@/components/session/HostOnlyTools";
import CommonTools from "@/components/session/CommonTools";

interface Props {
  requestChangeIndex: (
    type: "next" | "prev" | "current" | "move",
    index?: number
  ) => void;
  handleVideoToggle: () => void;
  handleMicToggle: () => void;
  emitReaction: (reactionType: string) => void;
  isHost: boolean;
  roomId: string;
  isInProgress: boolean;
  startStudySession: () => void;
  stopStudySession: () => void;
  currentIndex: number;
  maxQuestionLength: number;
  setShouldBlock: (shouldBlock: boolean) => void;
}

const SessionToolbar = ({
  requestChangeIndex,
  handleVideoToggle,
  handleMicToggle,
  emitReaction,
  isHost,
  roomId,
  isInProgress,
  startStudySession,
  stopStudySession,
  currentIndex,
  maxQuestionLength,
  setShouldBlock,
}: Props) => {
  return (
    <div className="session-footer h-16 inline-flex w-full justify-center items-center border-t px-6 shrink-0">
      <CommonTools
        handleVideoToggle={handleVideoToggle}
        handleMicToggle={handleMicToggle}
        emitReaction={emitReaction}
        isHost={isHost}
        roomId={roomId}
        setShouldBlock={setShouldBlock}
      />
      <HostOnlyTools
        isHost={isHost}
        isInProgress={isInProgress}
        stopStudySession={stopStudySession}
        startStudySession={startStudySession}
        requestChangeIndex={requestChangeIndex}
        maxQuestionLength={maxQuestionLength}
        currentIndex={currentIndex}
      />
    </div>
  );
};

export default SessionToolbar;
