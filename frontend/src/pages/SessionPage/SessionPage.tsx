import { useNavigate, useParams } from "react-router-dom";
import SessionSidebar from "@/pages/SessionPage/view/SessionSidebar";
import SessionToolbar from "@/pages/SessionPage/view/SessionToolbar";
import useSocket from "@hooks/useSocket";
import SessionHeader from "@/pages/SessionPage/view/SessionHeader";
import useToast from "@hooks/useToast";
import SidebarContainer from "@/pages/SessionPage/view/SidebarContainer";
import VideoLayout from "./view/VideoLayout";
import { useSession } from "./hooks/useSession";
import MediaPreviewModal from "@components/session/MediaPreviewModal.tsx";

const SessionPage = () => {
  const { sessionId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const {
    nickname,
    setNickname,
    reaction,
    peers,
    peerConnections,
    roomMetadata,
    isHost,
    participants,
    handleMicToggle,
    handleVideoToggle,
    joinRoom,
    emitReaction,
    peerMediaStatus,
    requestChangeIndex,
    startStudySession,
    stopStudySession,
    mediaPreviewModal,
    ready,
    setReady,
    setShouldBlock,
  } = useSession(sessionId!);

  if (!sessionId) {
    toast.error("유효하지 않은 세션 아이디입니다.");
    return null;
  }

  return (
    <section className="w-screen min-h-[500px] h-screen flex flex-col">
      <MediaPreviewModal
        modal={mediaPreviewModal}
        setReady={setReady}
        nickname={nickname}
        setNickname={setNickname}
        onConfirm={() => {
          joinRoom();
          mediaPreviewModal.closeModal();
        }}
        onReject={() => {
          mediaPreviewModal.closeModal();
          navigate("/");
        }}
      />
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
          {!ready ? (
            <div className={"h-full"}></div>
          ) : (
            <VideoLayout
              peers={peers}
              nickname={nickname}
              reaction={reaction}
              peerMediaStatus={peerMediaStatus}
              peerConnections={peerConnections}
            />
          )}
          <SessionToolbar
            requestChangeIndex={requestChangeIndex}
            handleVideoToggle={handleVideoToggle}
            handleMicToggle={handleMicToggle}
            emitReaction={emitReaction}
            isHost={isHost}
            roomId={sessionId}
            isInProgress={roomMetadata?.inProgress ?? false}
            startStudySession={startStudySession}
            stopStudySession={stopStudySession}
            currentIndex={roomMetadata?.currentIndex ?? -1}
            maxQuestionLength={roomMetadata?.questionListContents.length ?? 0}
            setShouldBlock={setShouldBlock}
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
