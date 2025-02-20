import { useNavigate, useParams } from "react-router-dom";
import SessionSidebar from "@/pages/SessionPage/view/SessionSidebar";
import SessionToolbar from "@/pages/SessionPage/view/SessionToolbar";
import SessionHeader from "@/pages/SessionPage/view/SessionHeader";
import useToast from "@hooks/useToast";
import SidebarContainer from "@/pages/SessionPage/view/SidebarContainer";
import VideoLayout from "./view/VideoLayout";
import MediaPreviewModal from "@components/session/MediaPreviewModal.tsx";
import useSocket from "@/hooks/useSocket";
import { useMediaStore } from "./stores/useMediaStore";
import { useSessionStore } from "./stores/useSessionStore";
import useModal from "@/hooks/useModal";
import usePeerConnection from "./hooks/usePeerConnection";
import { useEffect } from "react";
import useMediaStream from "./hooks/useMediaStream";
import { Socket } from "socket.io-client";
import { SESSION_EMIT_EVENT } from "@/constants/WebSocket/SessionEvent";
import { useStudyRoom } from "./hooks/useStudyRoom";

const SessionPage = () => {
  const { sessionId } = useParams();
  const { socket, disconnect } = useSocket();
  const toast = useToast();
  const navigate = useNavigate();

  const { isVideoOn, selectedVideoDeviceId, selectedAudioDeviceId } = useMediaStore();
  const { ready, setRoomId } = useSessionStore();

  const { peerConnections, dataChannels } = usePeerConnection(socket!);
  const { getMedia } = useMediaStream(dataChannels);
  useStudyRoom(socket!, disconnect);
  const mediaPreviewModal = useModal();

  useEffect(() => {
    mediaPreviewModal.openModal();
    setRoomId(sessionId!);
  }, []);

  useEffect(() => {
    if (selectedAudioDeviceId || selectedVideoDeviceId) {
      getMedia();
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId]);

  if (!sessionId) {
    toast.error("유효하지 않은 세션 아이디입니다.");
    return null;
  }

  const isValidUser = (
    socket: Socket | null,
    nickname: string
  ): socket is Socket => {
    if (!socket) {
      toast.error("소켓 연결이 필요합니다.");
      return false;
    }
    if (!nickname) {
      toast.error("닉네임을 입력해주세요.");
      return false;
    }

    return true;
  };

  const joinRoom = async (nickname: string) => {
    if (!isValidUser(socket, nickname)) return;

    const mediaStream = await getMedia();
    if (!mediaStream) {
      toast.error("미디어 스트림을 가져오지 못했습니다. 미디어 장치를 확인 후 다시 시도해주세요.");
      return;
    } else if (isVideoOn && mediaStream.getVideoTracks().length === 0) {
      toast.error("비디오 장치를 찾을 수 없습니다. 비디오 장치 없이 세션에 참가합니다.");
    } else if (mediaStream.getAudioTracks().length === 0) {
      toast.error("오디오 장치를 찾을 수 없습니다. 오디오 장치 없이 세션에 참가합니다.");
    }

    socket.emit(SESSION_EMIT_EVENT.JOIN, { roomId: sessionId, nickname });
  };

  return (
    <section className="w-screen min-h-[500px] h-screen flex flex-col">
      <MediaPreviewModal
        modal={mediaPreviewModal}
        onConfirm={async (nickname: string) => {
          await joinRoom(nickname);
          mediaPreviewModal.closeModal();
        }}
        onReject={() => {
          mediaPreviewModal.closeModal();
          navigate("/");
        }}
      />
      <div className="w-full flex flex-1 min-h-0">
        <div className="camera-area flex flex-col w-full flex-grow bg-gray-50 items-center">
          <SessionHeader />
          {!ready ? (
            <div className="h-full"></div>
          ) : (
            <VideoLayout peerConnections={peerConnections} socket={socket!} />
          )}
          <SessionToolbar socket={socket!} disconnect={disconnect} />
        </div>
        <SidebarContainer>
          <SessionSidebar />
        </SidebarContainer>
      </div>
    </section>
  );
};
export default SessionPage;
