import { useSessionStore } from "@/pages/channel/stores/useSessionStore";
import useStudyProgress from "@/pages/channel/hooks/useStudyProgress";
import StudyRoomControl from "./StudyRoomControl";
import QuestionNavigation from "./QuestionNavigation";

const HostOnlyTool = () => {
  const { isHost, roomMetadata } = useSessionStore();
  const { requestChangeIndex, startStudySession, stopStudySession } = useStudyProgress();

  if (!isHost) return null;

  return (
    <>
      <StudyRoomControl
        roomMetadata={roomMetadata}
        startStudySession={startStudySession}
        stopStudySession={stopStudySession}
      />
      {roomMetadata.inProgress && (
        <QuestionNavigation
          roomMetadata={roomMetadata}
          requestChangeIndex={requestChangeIndex}
        />
      )}
    </>
  )
};

export default HostOnlyTool;
