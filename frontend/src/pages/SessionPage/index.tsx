import { useParams } from "react-router-dom";
import SessionSidebar from "@/pages/SessionPage/view/SessionSidebar";
import SessionToolbar from "@/pages/SessionPage/view/SessionToolbar";
import useSocket from "@hooks/useSocket";
import SessionHeader from "@/pages/SessionPage/view/SessionHeader";
import useToast from "@hooks/useToast";
import SidebarContainer from "@/pages/SessionPage/view/SidebarContainer";
import VideoLayout from "./view/VideoLayout";
import { useSession } from "./hooks/useSession";

const SessionPage = () => {
  const { sessionId } = useParams();
  const toast = useToast();

  if (!sessionId) {
    toast.error("유효하지 않은 세션 아이디입니다.");
    return null;
  }

  const { socket } = useSocket();
  const {
    nickname,
    setNickname,
    reaction,
    peers,
    userVideoDevices,
    userAudioDevices,
    isVideoOn,
    isMicOn,
    stream,
    roomMetadata,
    isHost,
    participants,
    handleMicToggle,
    handleVideoToggle,
    setSelectedAudioDeviceId,
    setSelectedVideoDeviceId,
    joinRoom,
    emitReaction,
    videoLoading,
    peerMediaStatus,
    requestChangeIndex,
    startStudySession,
    stopStudySession,
  } = useSession(sessionId!);

  return (
    <section className="w-screen min-h-[500px] h-screen flex flex-col">
      {roomMetadata ? null : (
        <div className="w-full h-10 flex gap-2 bg-white shrink-0">
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={joinRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Join Room
          </button>
        </div>
      )}

      <div className={"w-full flex flex-1 min-h-0"}>
        <div
          className={
            "camera-area flex flex-col w-full flex-grow bg-gray-50 items-center"
          }
        >
          <SessionHeader
            roomMetadata={roomMetadata}
            participantsCount={peers.length + 1}
          />
          <VideoLayout
            peers={peers}
            nickname={nickname}
            isMicOn={isMicOn}
            isVideoOn={isVideoOn}
            stream={stream}
            reaction={reaction}
            videoLoading={videoLoading}
            peerMediaStatus={peerMediaStatus}
          />
          <SessionToolbar
            requestChangeIndex={requestChangeIndex}
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
            isHost={isHost}
            roomId={sessionId}
            isInProgress={roomMetadata?.inProgress ?? false}
            startStudySession={startStudySession}
            stopStudySession={stopStudySession}
            currentIndex={roomMetadata?.currentIndex ?? -1}
            maxQuestionLength={roomMetadata?.questionListContents.length ?? 0}
          />
        </div>
        <SidebarContainer>
          <SessionSidebar
            socket={socket}
            questionList={roomMetadata?.questionListContents ?? []}
            currentIndex={roomMetadata?.currentIndex ?? -1}
            participants={participants}
            roomId={sessionId}
            isHost={isHost}
          />
        </SidebarContainer>
      </div>
    </section>
  );
};
export default SessionPage;
