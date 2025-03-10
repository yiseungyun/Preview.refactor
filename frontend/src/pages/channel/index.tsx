import { useNavigate, useParams } from "react-router-dom";
import ChannelSidebar from "./ChannelSidebar";
import ChannelToolbar from "./ChannelToolbar";
import ChannelHeader from "./ChannelHeader";
import useToast from "@hooks/useToast";
import SidebarContainer from "./SidebarContainer";
import VideoLayout from "./VideoLayout";
import MediaPreviewModal from "@/components/channel/MediaPreviewModal";
import useSocket from "@/hooks/useSocket";
import { useMediaStore } from "./stores/useMediaStore";
import { useSessionStore } from "./stores/useSessionStore";
import useModal from "@/hooks/useModal";
import useWebRTCSession from "./hooks/useWebRTCSession";
import { useEffect } from "react";
import useMediaStream from "./hooks/useMediaStream";
import { Socket } from "socket.io-client";
import { SESSION_EMIT_EVENT } from "@/constants/WebSocket/SessionEvent";
import { useStudyRoom } from "./hooks/useStudyRoom";

const ChannelPage = () => {
  const { channelId } = useParams();
  const { socket, disconnect } = useSocket();
  const toast = useToast();
  const navigate = useNavigate();

  const isVideoOn = useMediaStore(state => state.isVideoOn);
  const selectedVideoDeviceId = useMediaStore(state => state.selectedVideoDeviceId);
  const selectedAudioDeviceId = useMediaStore(state => state.selectedAudioDeviceId);
  const setRoomId = useSessionStore(state => state.setRoomId);

  useWebRTCSession(socket!);
  const { getMedia } = useMediaStream(socket!);
  useStudyRoom(socket!, disconnect);
  const mediaPreviewModal = useModal();

  useEffect(() => {
    mediaPreviewModal.openModal();
    setRoomId(channelId!);
  }, []);

  useEffect(() => {
    if (selectedAudioDeviceId || selectedVideoDeviceId) {
      getMedia();
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId]);

  if (!channelId) {
    toast.error("유효하지 않은 채널입니다.");
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
      toast.error("비디오 장치를 찾을 수 없습니다. 비디오 장치 없이 채널에 참가합니다.");
    } else if (mediaStream.getAudioTracks().length === 0) {
      toast.error("오디오 장치를 찾을 수 없습니다. 오디오 장치 없이 채널에 참가합니다.");
    }

    socket.emit(SESSION_EMIT_EVENT.JOIN, { roomId: channelId, nickname });
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
          navigate("/channels");
        }}
      />
      <div className="w-full flex flex-1 min-h-0">
        <div className="flex flex-col w-full flex-grow bg-gray-50 items-center">
          <ChannelHeader />
          <VideoLayout socket={socket!} />
          <ChannelToolbar socket={socket!} disconnect={disconnect} />
        </div>
        <SidebarContainer>
          <ChannelSidebar />
        </SidebarContainer>
      </div>
    </section>
  );
};
export default ChannelPage;
