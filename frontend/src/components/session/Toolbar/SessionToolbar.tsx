import HostOnlyTools from "@components/session/Toolbar/HostOnlyTools.tsx";
import CommonTools from "@components/session/Toolbar/CommonTools.tsx";

interface Props {
  requestChangeIndex: (
    type: "next" | "prev" | "current" | "move",
    index?: number
  ) => void;
  handleVideoToggle: () => void;
  handleMicToggle: () => void;
  emitReaction: (reactionType: string) => void;
  userVideoDevices: MediaDeviceInfo[];
  userAudioDevices: MediaDeviceInfo[];
  setSelectedVideoDeviceId: (deviceId: string) => void;
  setSelectedAudioDeviceId: (deviceId: string) => void;
  isVideoOn: boolean;
  isMicOn: boolean;
  videoLoading: boolean;
  isHost: boolean;
  isInProgress: boolean;
  startStudySession: () => void;
  stopStudySession: () => void;
  currentIndex: number;
  maxQuestionLength: number;
}
const SessionToolbar = ({
  requestChangeIndex,
  handleVideoToggle,
  handleMicToggle,
  emitReaction,
  userVideoDevices,
  userAudioDevices,
  setSelectedVideoDeviceId,
  setSelectedAudioDeviceId,
  isVideoOn,
  isMicOn,
  videoLoading,
  isHost,
  isInProgress,
  startStudySession,
  stopStudySession,
  currentIndex,
  maxQuestionLength,
}: Props) => {
  return (
    <div
      className={
        "session-footer h-16 inline-flex w-full justify-center items-center border-t px-6 shrink-0"
      }
    >
      <CommonTools
        handleVideoToggle={handleVideoToggle}
        handleMicToggle={handleMicToggle}
        emitReaction={emitReaction}
        userVideoDevices={userVideoDevices}
        userAudioDevices={userAudioDevices}
        setSelectedVideoDeviceId={setSelectedVideoDeviceId}
        setSelectedAudioDeviceId={setSelectedAudioDeviceId}
        isVideoOn={isVideoOn}
        isMicOn={isMicOn}
        videoLoading={videoLoading}
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
